#!/usr/bin/env python3

""" 

Read blame data for every file for every author from local repo store

Taking inspiration from:
https://github.com/Semalab/backend-gitblame/blob/master/src/main/java/semalab/gitblame/GitBlameRunner.java

CLI wishlist
  sema create_project elasticsearch --org_name Demo
  sema get_blame --project_name elasticsearch --repo_url https://github.com/elasticsearch/elasticsearch

"""

import os
import argparse
import logging
import re
from pathlib import Path
import subprocess
from urllib.parse import urlparse
import errno
import csv
import datetime

class Shell:
    def run(command):
        return subprocess.check_output(command).decode()

    def run_command_read_lines(cmd):
        # https://stackoverflow.com/a/28995273/771112
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
        for line in proc.stdout:
            yield line.decode() # stream lines as we receive them

class GetBlame:

    def get_files(config):
        for line in Shell.run_command_read_lines(["git", "-C", config.repo_dir, "ls-tree", "-r", "--name-only", "HEAD"]):
            yield line
    
    def get_blame(config):
        # fe_re = re.compile(r'\.js$|.py$|\.java$|\.c$|\.cc$|\.cpp$|\.cxx$|\.h$|\.hpp$|\.hxx$|\.swift$|\.ts$|\.rb$|\.php$|\.scala$|\.cs$')
        fe_re = re.compile(r'.*\.js$|.*\.py$|.*\.java$|.*\.c$|.*\.cc$|.*\.cpp$|.*\.cxx$|.*\.h$|.*\.hpp$|.*\.hxx$|.*\.swift$|.*\.ts$|.*\.rb$|.*\.php$|.*\.scala$|.*\.cs$')
        auth_ln_re = re.compile(r'[0-f]{40} .* \((?P<author_name>.*) [0-9]{4}-[0-9]{2}-[0-9]{2} *(?P<line_num>[0-9]*)\).* ')
        for filename in GetBlame.get_files(config):
            fn = filename.strip()
            if fe_re.match(fn):
                for blame_line in Shell.run_command_read_lines(["git", "-C", config.repo_dir, "blame", "-f", "-l", "--pretty=short", "--date=short", "--root", fn]):
                    for match in re.finditer(auth_ln_re, blame_line):
                        yield { 'file_path':fn, 'author_name':match.group('author_name').strip(), 'line_num': match.group('line_num')}
    
    def get_blame_short(config):
        cur_file = None
        cur_author = None
        start_line = None
        end_line = None
        for bl in GetBlame.get_blame(config):
            if bl['file_path'] == cur_file and bl['author_name'] == cur_author and str((int(bl['line_num']) -1 )) == end_line:
                end_line = bl['line_num']
            else:
                if cur_file is not None:
                    yield { 'file_path': cur_file, 'author_name': cur_author, 'start_line': start_line, 'end_line': end_line }
                cur_file = bl['file_path']
                cur_author =  bl['author_name']
                start_line = bl['line_num']
                end_line = bl['line_num']
        if cur_file is not None:
            yield { 'file_path': cur_file, 'author_name': cur_author, 'start_line': start_line, 'end_line': end_line }

                
class Persistence:
    print_header = True

    def persist_csv_line(config, line):
        if Persistence.print_header:
            with open(config.proj+'.csv', 'w') as out_file:
                out_writer = csv.writer(out_file, delimiter=',')
                header = line.keys()
                out_writer.writerow(header)
                csv_row = line.values()
                out_writer.writerow(csv_row)
                Persistence.print_header = False
        else:
            with open(config.proj+'.csv', 'a') as out_file:
                out_writer = csv.writer(out_file, delimiter=',')
                csv_row = line.values()
                out_writer.writerow(csv_row)
        
    def persist_row(config, line):
        line.update({ 'project_id': config.proj, 'commit_hash': config.commit_hash})
        # TODO add kinesis stream support
        # print(line)
        Persistence.persist_csv_line(config, line)

    def persist_iter(config, blame_iter):
        count=0
        with open(config.proj+'.csv', 'w') as out_file:
            out_writer = csv.writer(out_file, delimiter=',')
            for blame_line in blame_iter:
                blame_line.update({ 'project_id': config.proj, 'commit_hash': config.commit_hash, 'commit_timestamp':config.commit_timestamp })
                if Persistence.print_header:
                    header = blame_line.keys()
                    out_writer.writerow(header)
                    Persistence.print_header = False
                csv_row = blame_line.values()
                out_writer.writerow(csv_row)
                count += 1
        print(f'Persisted {count} rows of data')

    def print(config, blame_iter):
        for blame_line in blame_iter:
            blame_line.update({ 'project_id': config.proj, 'commit_hash': config.commit_hash, 'commit_timestamp':config.commit_timestamp})
            print(blame_line)
            
def parse_args():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
        epilog='Example of use: ./get_blame.py /home/ubuntu/customer-repos/Demo/locoGP'
    )
    parser.add_argument("-v", "--verbosity",
                        help="logging verbosity",
                        default=logging.WARN)

    parser.add_argument("repo_dir",
                        help="Directory which holds target git repo where blame will be read from")

    parser.add_argument("-o", "--org_name",
                        help="Organization name (will be extracted from repo dir if not specified)")
    parser.add_argument("-p", "--project_name",
                        help="Project name (will be extracted from repo dir if not specified)")

    parser.add_argument("--project_id", help=
                        "Specifies the id of the project to ingest")

    args = parser.parse_args()

            
    if not os.path.exists(args.repo_dir):
        print("Error: the repo directory does not exist, expecting something like /src/customer-repos/Demo/locoGP")
        raise FileNotFoundError(
            errno.ENOENT, os.strerror(errno.ENOENT), args.repo_dir)
        
    # if no project or org name set, work it out from the URL
    if not args.org_name:
        args.org_name = urlparse(args.repo_dir).path.split(os.sep)[-1]
    if not args.project_name:
        args.project_name = urlparse(args.repo_dir).path.split(os.sep)[-2]

    args.commit_hash = Shell.run(['git', '-C', args.repo_dir, 'rev-parse', 'HEAD']).strip()

    args.commit_timestamp = datetime.datetime.strptime(
        Shell.run(['git', '-C', args.repo_dir, 'log', '-1', '--format=%cd', '--date=iso', 'HEAD']).strip(),
        "%Y-%m-%d %H:%M:%S %z") # Wed Nov 18 18:10:15 2020 +0000

    args.proj = args.project_id if args.project_id else args.project_name
            
    return args


def main():
    print('Copyright © 2020 SEMA Labs Inc.  All Rights Reserved. '+ os.path.basename(__file__))
    config = parse_args()

    #for bl in GetBlame.get_blame_short(config):
    #    Persistence.persist_row(config, bl)

    # half a second for 594 rows, roughly the same as above
    Persistence.persist_iter(config, GetBlame.get_blame_short(config))

    # Persistence.print(config, GetBlame.get_blame_short(config))
    
    #for bl in GetBlame.get_blame(config):
    #    Persistence.persist_row(config, bl)

    # iter is a bit faster here
    # Persistence.persist_iter(config, GetBlame.get_blame(config))
    
if __name__ == '__main__':
    main()



