#!/usr/bin/env bash
set -euo pipefail

HELP="
NAME
    $0 - deploy chrome extension.

USAGE
    Usage: $0 [ -i GOOGLE_CLIENT_ID ] [ -s GOOGLE_CLIENT_SECRET ] [ -t GOOGLE_REFRESH_TOKEN ] [ -a GOOGLE_APP_ID ]

REQUIRED ARGUMENTS

    -a GOOGLE_APP_ID
        Google app id for API.

REQUIRED ENVIRONMENT VARIABLES
    GOOGLE_CLIENT_ID
        Google client id for API.
    GOOGLE_CLIENT_SECRET
        Google client secret for API.
    GOOGLE_REFRESH_TOKEN
        Google refresh token for API.
"
fail_on_params() {
    echo "${HELP}"
    exit 1
}

check_required_env_var() {
    local value
    value="${1}"
    if [ -z "${value}" ]; then
        echo "\$${value} is empty"
        exit 0
    fi
}

check_required_argument() {
    local value param
    param="${1}"
    value="${2}"
    [ -z "${value}" ] && (
        echo "ERROR: Argument '${param}' is required"
        fail_on_params
    )
    return 0
}

while getopts 'h:a:' option; do
    case ${option} in
    h)
        echo "${HELP}"
        exit 0
        ;;
    a) GOOGLE_APP_ID="${OPTARG}" ;;
    *) fail_on_params ;;
    esac
done

check_required_env_var "${GOOGLE_CLIENT_ID}"
check_required_env_var "${GOOGLE_CLIENT_SECRET}"
check_required_env_var "${GOOGLE_REFRESH_TOKEN}"
check_required_argument "-a" "${GOOGLE_APP_ID}"

filename=$(find . -name '*Sema_Code_Review_Assistant_*' | head -1)

if [ ! -f $filename ]; then
    echo "File does not exist"
    exit 0
fi

echo "Getting temporary access token"
ACCESS_TOKEN=$(curl -s "https://accounts.google.com/o/oauth2/token" -d "client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&refresh_token=${GOOGLE_REFRESH_TOKEN}&grant_type=refresh_token&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | jq -r .access_token)
echo "Uploading the extension"
curl -s -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -X PUT -T ${filename} "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${GOOGLE_APP_ID}" | jq
echo "Publishing the extension"
curl -s -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST "https://www.googleapis.com/chromewebstore/v1.1/items/${GOOGLE_APP_ID}/publish" | jq
echo "Done"
