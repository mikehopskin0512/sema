#!/usr/bin/env python3

"""

Call file to get mime

"""

import get_cli_csv


def main():
    config = type("", (), {})
    # should we just have get_cli read this from config?
    config.tool_name = "mime"
    config.data_row_match_regex = r".+: (?P<mimetype>.+); charset=(?P<charset>.+)"
    config.cli_command = ["file", "-i", "x-filename-placeholder-x"]

    get_cli_csv.get_cmd_csv(config)


if __name__ == "__main__":
    main()
