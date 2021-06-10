#!/usr/bin/env python3

"""

Call a cli tool for every file for every author from local repo store

Design decision: use as a library, or load cli/regex from config file

"""

import os
import argparse
import re
import subprocess
from urllib.parse import urlparse
import csv
import datetime
import time
import sys


def run_command(command):
    return subprocess.check_output(command).decode().strip()


def get_wc(config):
    # fe_re = re.compile(r'\.js$|.py$|\.java$|\.c$|\.cc$|\.cpp$|\.cxx$|\.h$|\.hpp$|\.hxx$|\.swift$|\.ts$|\.rb$|\.php$|\.scala$|\.cs$')
    fe_re = re.compile(
        r".*\.js$|.*\.py$|.*\.java$|.*\.c$|.*\.cc$|.*\.cpp$|.*\.cxx$|.*\.h$|.*\.hpp$|.*\.hxx$|.*\.swift$|.*\.ts$|.*\.rb$|.*\.php$|.*\.scala$|.*\.cs$"
    )
    if hasattr(config, "regex_flags"):
        auth_ln_re = re.compile(
            config.data_row_match_regex,
            flags=config.regex_flags,  # re.DOTALL | re.MULTILINE
        )
    else:
        auth_ln_re = re.compile(config.data_row_match_regex)

    fn = config.repo_file_path
    if fe_re.match(fn):
        cmd_line = run_command(
            [
                x
                if x != "x-filename-placeholder-x"
                else (config.repo_dir + os.sep + fn)
                for x in config.cli_command
            ]
        )
        for match in re.finditer(auth_ln_re, cmd_line):
            return_data = {"file_path": fn}
            return_data.update(match.groupdict())
            yield return_data


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
                    "project_name": config.project_name,
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
        + " ~/source/phoenix/web/src/pages/sources/tabs.js",
    )

    parser.add_argument(
        "analysis_target_file",  # repo_dir, a sub-dir within the repo dir, or a specific file
        help="File that will be analysed",
    )

    args = parser.parse_args()

    if os.path.isfile(args.analysis_target_file):
        args.analysis_target_file = os.path.abspath(args.analysis_target_file)
        args.repo_dir = run_command(
            [
                "git",
                "-C",
                os.path.dirname(args.analysis_target_file),
                "rev-parse",
                "--show-toplevel",
            ]
        )
    else:
        print("Error: could not find analysis target file " + args.analysis_target_file)
        sys.exit(1)

    args.repo_file_path = args.analysis_target_file[len(args.repo_dir):]
    while args.repo_file_path.startswith(os.sep):
        args.repo_file_path = args.repo_file_path[1:]
    while args.repo_file_path.endswith(os.sep):
        args.repo_file_path = args.repo_file_path[:-1]

    print("Will analyze: " + args.repo_file_path + " in " + args.repo_dir)

    args.org_name = urlparse(args.repo_dir).path.split(os.sep)[-2]
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

    args.tool_name = config.tool_name
    args.data_row_match_regex = config.data_row_match_regex
    if hasattr(config, "regex_flags"):
        args.regex_flags = config.regex_flags
    args.cli_command = config.cli_command
    if hasattr(config, "extra_processing"):
        args.extra_processing = config.extra_processing

    args.out_file = (
        args.project_name
        + "."
        + args.tool_name
        + "."
        + time.strftime("%Y%m%d%H%M%S")
        + ".csv"
    )

    return args


def get_cmd_csv(cli_cmd_config):
    print(
        "Copyright © 2020 SEMA Labs Inc.  All Rights Reserved. "
        + os.path.basename(__file__)
    )
    config = parse_args(cli_cmd_config)

    if hasattr(config, "extra_processing"):
        persist_iter(
            config, config.extra_processing(config, get_wc)
        )  # we pass in the normal cli function, get results from it and then perform extra processing of the output
    else:
        persist_iter(config, get_wc(config))
