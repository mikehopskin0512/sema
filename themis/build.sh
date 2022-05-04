#!/usr/bin/env bash
set -euo pipefail

readonly ENV="${1}"

if [[ -z ${ENV} ]]; then
  printf "environment name (localhost, qa, prod) must me specified, e.g. ./build.sh qa \n"
  exit 1
fi

if [ "${ENV}" = "localhost" ]; then
  cp .env.localhost .env
elif [ "${ENV}" = "qa" ]; then
  cp .env.qa .env
elif [ "${ENV}" = "qa1" ]; then
  cp .env.qa1 .env
elif [ "${ENV}" = "prod" ]; then
  cp .env.prod .env
elif [ "${ENV}" = "staging" ]; then
  cp .env.staging .env
fi
npm run changeV
npm ci

pushd ../adonis
npm ci
npm run build
popd

npm run build
zip -r build.zip build
# or chrome.exe --pack-extension=build
semaextfn="Sema_Code_Review_Assistant_${ENV}_$(date +"%Y%m%d%H%M%S")_$(git rev-parse HEAD)"
echo -e "\nBuilt chrome extension for the following environment: \n"
sed 's/^/    /' .env
mv build.zip "$semaextfn".zip
echo -e "\n\n(now reverting .env file to .env.localhost)"
cp .env.localhost .env
