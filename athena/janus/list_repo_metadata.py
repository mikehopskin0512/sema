#!/usr/bin/env python3

"""

Given a repo dir, start and end hash, list either: all commits between, or all files changed between the hashes.

"""

import os
import argparse
import logging
import subprocess
import errno
import json


def run_command_read_lines(cmd):
    # https://stackoverflow.com/a/28995273/771112
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    for line in proc.stdout:
        yield line.decode().strip()  # stream lines as we receive them


def list_commits_between(start_hash, end_hash, repo_dir):
    commits = [
        x
        for x in run_command_read_lines(
            [
                "git",
                "-C",
                repo_dir,
                "rev-list",
                "--ancestry-path",
                start_hash + ".." + end_hash,
            ]
        )
    ]
    return commits


def list_files_changed_between(start_hash, end_hash, repo_dir):
    files = [
        x
        for x in run_command_read_lines(
            ["git", "-C", repo_dir, "diff", "--name-only", start_hash, end_hash]
        )
    ]
    return files


def list_repo_meta(config):
    data_type = ""
    repo_data_list = []
    if config.list_what == "list_hashes":
        data_type = "commits"
        repo_data_list = list_commits_between(
            config.start_hash, config.end_hash, config.repo_dir
        )
    elif config.list_what == "list_changed_files":
        data_type = "files"
        repo_data_list = list_files_changed_between(
            config.start_hash, config.end_hash, config.repo_dir
        )

    return json.dumps({data_type: repo_data_list})


def parse_args():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
        epilog="Example of use: ./list_repo_metadata.py list_hashes --repo_dir . --end_hash 2f10f16e3f8c67b88312f064ccca883437d08978  --start_hash  1ac46ce77cb209c997acc109753241c808b1974e",
    )
    parser.add_argument(
        "-v", "--verbosity", help="logging verbosity", default=logging.WARN
    )

    parser.add_argument(
        "list_what",
        type=str,
        choices=["list_changed_files", "list_hashes"],
        help="What information do you want to list from the repo metadata?",
    )

    parser.add_argument(
        "-r", "--repo_dir", help="Directory that is the target of our analysis"
    )

    parser.add_argument(
        "-s", "--start_hash", help="Commit hash to start from (earlier in time)"
    )
    parser.add_argument(
        "-e", "--end_hash", help="Commit hash to end on (later in time)"
    )

    args = parser.parse_args()

    if not os.path.exists(args.repo_dir):
        print(
            "Error: the repo directory does not exist, expecting something like /src/customer-repos/Demo/locoGP"
        )
        raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), args.repo_dir)

    return args


def execute_shell(command):
    return subprocess.check_output(command).decode().strip()


def main():
    print(
        "Copyright © 2020 SEMA Labs Inc.  All Rights Reserved. "
        + os.path.basename(__file__)
    )
    config = parse_args()
    print(list_repo_meta(config))


if __name__ == "__main__":
    main()
