#!/usr/bin/env python3

"""

Retrieve repo to local repo store, update repo to latest if already in store

Taking inspiration from:
https://github.com/Semalab/backend-codesync/blob/master/src/main/java/semalab/processing/CodesyncRunner.java#L139

Wouldn't it be nice to have a cli tool to do the following:
  sema create_project elasticsearch --org_name Demo
  sema get_repo --project_name elasticsearch --repo_url https://github.com/elasticsearch/elasticsearch
  sema run_aqi --project_name elasticsearch
  sema status --job aqi --project_name elasticsearch

"""

import os
import argparse
import logging
import subprocess
from urllib.parse import urlparse, quote
import errno


def get_repo(config):
    repo_url = get_repo_auth_uri(config)
    customer_source_destination_dir = (
        config.customer_source_dir + "/" + config.org_name + "/" + config.project_name
    )
    branch = config.branch if hasattr(config, "branch") else "master"
    print("Will retrieve repository to " + customer_source_destination_dir)
    if not os.path.exists(customer_source_destination_dir):
        execute_shell(["mkdir", "-p", customer_source_destination_dir])
        try:
            execute_shell(["git", "clone", repo_url, customer_source_destination_dir])
            new = True
        except subprocess.CalledProcessError:
            execute_shell(["rmdir", customer_source_destination_dir])
            return
    else:
        execute_shell(["git", "-C", customer_source_destination_dir, "fetch"])
        new = False
    execute_shell(
        ["git", "-C", customer_source_destination_dir, "checkout", "-f", branch]
    )
    if not new:
        execute_shell(
            [
                "git",
                "-C",
                customer_source_destination_dir,
                "reset",
                "--hard",
                "origin/" + branch,
            ]
        )


def get_repo_auth_uri(config):
    print("Will retrieve: " + config.repo_url)
    url = urlparse(config.repo_url)
    if config.repo_username and config.repo_password:
        url = url._replace(
            netloc="{}:{}@{}".format(
                config.repo_username, quote(config.repo_password), url.hostname
            )
        )
    return url.geturl()


def parse_args():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
        epilog="Example of use: ./get_repo.py https://github.com/Semalab/locoGP --repo_username codykenb --repo_password secretpassword --customer_source_dir /home/ubuntu/customer-repos",
    )
    parser.add_argument(
        "-v", "--verbosity", help="logging verbosity", default=logging.WARN
    )

    parser.add_argument(
        "repo_url",
        metavar="repoitory url",
        type=str,
        help="Git repoitory url to retrieve",
    )

    parser.add_argument(
        "-c",
        "--customer_source_dir",
        help="Directory which holds all repo for all organizations",
        default=("/src/customer-repos"),
    )  # assuming docker here

    parser.add_argument(
        "-o",
        "--org_name",
        help="Organization name (will be extracted from repo url if not specified)",
    )

    parser.add_argument(
        "-p",
        "--project_name",
        help="Project name (will be extracted from repo url if not specified)",
    )

    parser.add_argument("--repo_username", help="Username for repo")
    parser.add_argument("--repo_password", help="Password for repo")

    args = parser.parse_args()

    if (args.repo_password and not args.repo_username) or (
        args.repo_username and not args.repo_password
    ):
        raise ValueError("repo_username must be used with repo_password")

    # if no project or org name set, work it out from the URL
    if not args.org_name:
        args.org_name = urlparse(args.repo_url).path.split(os.sep)[1]
    if not args.project_name:
        args.project_name = urlparse(args.repo_url).path.split(os.sep)[2]

    if not os.path.exists(args.customer_source_dir):
        print(
            "Error: the base customer source directory does not exist, expecting something like /src/customer-repos"
        )
        raise FileNotFoundError(
            errno.ENOENT, os.strerror(errno.ENOENT), args.customer_source_dir
        )

    return args


def execute_shell(command):
    return subprocess.check_output(command)


def main():
    print(
        "Copyright © 2020 SEMA Labs Inc.  All Rights Reserved. "
        + os.path.basename(__file__)
    )
    config = parse_args()
    get_repo(config)


if __name__ == "__main__":
    main()
