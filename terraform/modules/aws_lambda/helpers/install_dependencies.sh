#!/bin/bash

echo "Executing install_dependencies..."

cd "${path_cwd}" || exit

# Installing python dependencies...
FILE="${path_cwd}/requirements.txt"
DIR="${path_cwd}/packages"

if [ -d "${DIR}" ]; then
    rm -rf "${DIR}"
fi

if [ -f "${FILE}" ]; then
    echo "Installing dependencies..."
    echo "From: requirement.txt file exists..."
    pip install --target ./packages -r "${FILE}"
else
    echo "Error: requirement.txt does not exist!"
fi

echo "Finished script execution!"
