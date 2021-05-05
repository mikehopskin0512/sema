#!/usr/bin/env bash
set -euo pipefail

readonly ENV="${1}"

if [[ -z ${ENV} ]]; then
  printf "environment name (localhost, qa, prod) must me specified, e.g. ./build-and-deploy.sh qa \n"
  exit 1
fi

if [  "${ENV}" = "localhost" ] ; then
 cp .env.localhost .env
elif [  "${ENV}" = "qa" ] ; then
 cp .env.qa .env
elif [  "${ENV}" = "prod" ] ; then
 cp .env.prod .env
fi

if [ ! -f node_modules/crx3/bin/crx3.js ]; then
    npm install
fi

npm run build
node_modules/crx3/bin/crx3.js build
# or chrome.exe --pack-extension=build
semaextfn="Sema_Code_Review_Assistant_${ENV}_$(date +"%Y%m%d%H%M%S")_$(git rev-parse HEAD)"
echo "Built chrome extension for the following environment: "
cat .env
mv build.crx "$semaextfn".crx
# mv build.pem "$semaextfn".pem

cp .env.localhost .env
