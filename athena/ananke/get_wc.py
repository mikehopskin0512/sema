#!/usr/bin/env python3

"""

Call wc

"""

import get_cli_csv


def main():
    config = type("", (), {})
    # should we just have get_cli read this from config?
    config.tool_name = "wc"
    config.data_row_match_regex = (
        r" *(?P<line_count>[0-9]+) *(?P<word_count>[0-9])+ *(?P<byte_count>[0-9]+) .*"
    )
    config.cli_command = ["wc", "x-filename-placeholder-x"]

    get_cli_csv.get_cmd_csv(config)


if __name__ == "__main__":
    main()
