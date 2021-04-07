#!/usr/bin/env python3

"""

Call file to get language

"""

import get_cli_csv
import re


def main():
    config = type("", (), {})
    # should we just have get_cli read this from config?
    config.tool_name = "enry"

    """
    enry-v1.1.0-linux-amd64.tar.gz: 11425 lines (11396 sloc)
    type:      Binary
    mime_type: text/plain
    language:
    vendored:  false
    """
    config.data_row_match_regex = r".*: (?P<line_count>[0-9]+) lines \((?P<sloc_count>[0-9]+) sloc\) *$.* *type: *(?P<file_type>[^\s]*)\s*language: *(?P<language>[^\s]*)\s*vendored: *(?P<vendored>[^\s]*)"
    config.regex_flags = re.DOTALL | re.MULTILINE
    config.cli_command = ["./enry", "x-filename-placeholder-x"]

    get_cli_csv.get_cmd_csv(config)


if __name__ == "__main__":
    main()
