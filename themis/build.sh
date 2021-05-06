#!/usr/bin/env bash
set -euo pipefail

if [ ! -f node_modules/crx3/bin/crx3.js ]; then
    npm install
fi

npm run build
node_modules/crx3/bin/crx3.js build
# or chrome.exe --pack-extension=build
semaextfn="Sema_Code_Review_Assistant_$(date +"%Y%m%d%H%M%S")_$(git rev-parse HEAD)"
mv build.crx "$semaextfn".crx
# mv build.pem "$semaextfn".pem
