#!/usr/bin/env python3

""" 

Call a cli tool for every file for every author from local repo store

Design decision: use as a library, or load cli/regex from config file

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
import time
import json

# Shell commands
def run_command(command):
    return subprocess.check_output(command).decode().strip()


def run_command_read_lines(cmd):
    # https://stackoverflow.com/a/28995273/771112
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    for line in proc.stdout:
        yield line.decode().strip()  # stream lines as we receive them


def get_files(config):
    for line in run_command_read_lines(
        ["git", "-C", config.repo_dir, "ls-tree", "-r", "--name-only", "HEAD"]
    ):
        yield line


def get_wc(config):
    # fe_re = re.compile(r'\.js$|.py$|\.java$|\.c$|\.cc$|\.cpp$|\.cxx$|\.h$|\.hpp$|\.hxx$|\.swift$|\.ts$|\.rb$|\.php$|\.scala$|\.cs$')
    fe_re = re.compile(
        r".*\.js$|.*\.py$|.*\.java$|.*\.c$|.*\.cc$|.*\.cpp$|.*\.cxx$|.*\.h$|.*\.hpp$|.*\.hxx$|.*\.swift$|.*\.ts$|.*\.rb$|.*\.php$|.*\.scala$|.*\.cs$"
    )
    auth_ln_re = re.compile(config.data_row_match_regex, flags=re.DOTALL | re.MULTILINE)
    for filename in get_files(config):
        fn = filename.strip()
        if fe_re.match(fn):
            cmd_line = run_command(
                [
                    x
                    if x != "x-filename-placeholder-x"
                    else (config.repo_dir + os.sep + fn)
                    for x in config.cli_command
                ]
            )
            #            for cmd_line in run_command_read_lines( [ x if x != "x-filename-placeholder-x" else (config.repo_dir + os.sep + fn) for x in config.cli_command ]
            #            ):
            for match in re.finditer(auth_ln_re, cmd_line):
                return_data = {"file_path": fn}
                return_data.update(match.groupdict())
                yield return_data


# Persistence
print_header = True


def persist_csv_line(config, line):
    global print_header
    if print_header:
        with open(config.out_file, "w") as out_file:
            out_writer = csv.writer(out_file, delimiter=",")
            header = line.keys()
            out_writer.writerow(header)
            csv_row = line.values()
            out_writer.writerow(csv_row)
            print_header = False
    else:
        with open(config.out_file, "a") as out_file:
            out_writer = csv.writer(out_file, delimiter=",")
            csv_row = line.values()
            out_writer.writerow(csv_row)


def persist_row(config, line):
    line.update({"project_id": config.proj, "commit_hash": config.commit_hash})
    # TODO add kinesis stream support
    # print(line)
    persist_csv_line(config, line)


def persist_iter(config, data_iter):
    global print_header
    count = 0
    with open(config.out_file, "w") as out_file:
        out_writer = csv.writer(out_file, delimiter=",")
        for data_line in data_iter:
            data_line.update(
                {
                    "project_id": config.proj,
                    "commit_hash": config.commit_hash,
                    "commit_timestamp": config.commit_timestamp,
                }
            )
            if print_header:
                header = data_line.keys()
                out_writer.writerow(header)
                print_header = False
            csv_row = data_line.values()
            out_writer.writerow(csv_row)
            count += 1
    print(f"Persisted {count} rows of data")


def print_data_row(config, data_iter):
    for data_line in data_iter:
        data_line.update(
            {
                "project_id": config.proj,
                "commit_hash": config.commit_hash,
                "commit_timestamp": config.commit_timestamp,
            }
        )
        print(data_line)


def parse_args(config=None):
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
        epilog="Example of use: ./"
        + os.path.basename(__file__)
        + " /home/ubuntu/customer-repos/Demo/locoGP",
    )
    parser.add_argument(
        "-v", "--verbosity", help="logging verbosity", default=logging.WARN
    )

    parser.add_argument(
        "analysis_target",  # repo_dir, a sub-dir within the repo dir, or a specific file
        help="File or Directory that will be analysed",
    )

    parser.add_argument(
        "-o",
        "--org_name",
        help="Organization name (will be extracted from repo dir if not specified)",
    )
    parser.add_argument(
        "-p",
        "--project_name",
        help="Project name (will be extracted from repo dir if not specified)",
    )

    parser.add_argument(
        "--project_id", help="Specifies the id of the project to ingest"
    )

    #    parser.add_argument(
    #        "--tool_config_file", help="Specifies what cli command to run and how to parse resulting output",
    #        required=True
    #    )

    args = parser.parse_args()

    if os.path.isfile(args.analysis_target):
        args.analysis_target_file = args.analysis_target
        args.repo_dir = run_command(
            [
                "git",
                "-C",
                os.path.dirname(args.analysis_target),
                "rev-parse",
                "--show-toplevel",
            ]
        )
    else:
        args.repo_dir = run_command(
            ["git", "-C", args.analysis_target, "rev-parse", "--show-toplevel"]
        )

    if not os.path.exists(args.repo_dir):
        print(
            "Error: the repo directory does not exist, expecting something like /src/customer-repos/Demo/locoGP"
        )
        raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), args.repo_dir)

    # if a sub-dir of the toplevel repo dir is passed in
    args.file_filter = args.analysis_target[len(args.repo_dir) :]
    while args.file_filter.startswith(os.sep):
        args.file_filter = args.file_filter[1:]
    while args.file_filter.endswith(os.sep):
        args.file_filter = args.file_filter[:-1]

    print("Repo dir: " + args.repo_dir)
    print("Will analyze: " + args.analysis_target)

    # if no project or org name set, work it out from the URL
    if not args.org_name:
        args.org_name = urlparse(args.repo_dir).path.split(os.sep)[-2]
    if not args.project_name:
        args.project_name = urlparse(args.repo_dir).path.split(os.sep)[-1]

    args.commit_hash = run_command(["git", "-C", args.repo_dir, "rev-parse", "HEAD"])

    args.commit_timestamp = datetime.datetime.strptime(
        run_command(
            [
                "git",
                "-C",
                args.repo_dir,
                "log",
                "-1",
                "--format=%cd",
                "--date=iso",
                "HEAD",
            ]
        ),
        "%Y-%m-%d %H:%M:%S %z",
    )  # Wed Nov 18 18:10:15 2020 +0000

    args.proj = args.project_id if args.project_id else args.project_name

    args.tool_name = config.tool_name
    args.data_row_match_regex = config.data_row_match_regex
    args.cli_command = config.cli_command

    args.out_file = (
        args.proj + "." + args.tool_name + "." + time.strftime("%Y%m%d%H%M%S") + ".csv"
    )

    return args


def get_cmd_csv(cli_cmd_config):
    print(
        "Copyright © 2020 SEMA Labs Inc.  All Rights Reserved. "
        + os.path.basename(__file__)
    )
    config = parse_args(cli_cmd_config)

    persist_iter(config, get_wc(config))
