#!/usr/bin/env python3

""" 

Read blame data for every file for every author from local repo store

Taking inspiration from:
https://github.com/Semalab/backend-gitblame/blob/master/src/main/java/semalab/gitblame/GitBlameRunner.java

CLI wishlist
  sema create_project elasticsearch --org_name Demo
  sema get_blame --project_name elasticsearch --repo_url https://github.com/elasticsearch/elasticsearch

"""

""" 
Call file to get mime
"""

import get_cli_csv


def get_blame_short(config, normal_function):
    # TODO is there a better way of structuring this extra processing?
    cur_file = None
    cur_author = None
    start_line = None
    end_line = None
    for bl in normal_function(config):
        if (
            bl["file_path"] == cur_file
            and bl["author_name"] == cur_author
            and str((int(bl["line_num"]) - 1)) == end_line
        ):
            end_line = bl["line_num"]
        else:
            if cur_file is not None:
                yield {
                    "file_path": cur_file,
                    "author_name": cur_author,
                    "start_line": start_line,
                    "end_line": end_line,
                }
            cur_file = bl["file_path"]
            cur_author = bl["author_name"]
            start_line = bl["line_num"]
            end_line = bl["line_num"]
    if cur_file is not None:
        yield {
            "file_path": cur_file,
            "author_name": cur_author,
            "start_line": start_line,
            "end_line": end_line,
        }


def main():
    config = type("", (), {})
    config.tool_name = "blame"
    config.data_row_match_regex = r"[0-f]{40} .* \((?P<author_name>.*)\s+[0-9]{4}-[0-9]{2}-[0-9]{2} *(?P<line_num>[0-9]*)\) .*"
    config.cli_command = [
        "git",
        "blame",
        "-f",
        "-l",
        "--pretty=short",
        "--date=short",
        "--root",
        "x-filename-placeholder-x",
    ]
    config.extra_processing = get_blame_short
    get_cli_csv.get_cmd_csv(config)

if __name__ == "__main__":
    main()
