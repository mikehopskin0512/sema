#!/bin/bash
set -euo pipefail
readonly NAME=phoenix
readonly ENV="${1}"
readonly BRANCH="${2}"

if [[ -z ${ENV} ]]; then
    printf "environment name (prod,qa etc) must me specified, e.g. ./build.sh staging release-20... \n"
    exit 1
fi

if [[ -z ${BRANCH} ]]; then
    printf "environment name (prod,qa etc) must me specified, e.g. ./build.sh staging release-20... \n"
    exit 1
fi

NODE_ENV=production
DOCKER_FILE=../.docker/web/Dockerfile.prod

SHA1=$(git rev-parse HEAD)
VERSION=$BRANCH-$SHA1-$NODE_ENV

cp .env.$ENV .env

# copy temp dir
if [ -d ../adonis ]; then
    cp -r ../adonis ./adonis
fi

# Build and push the image
echo "Building image..."
docker build -f $DOCKER_FILE -t $NAME:$VERSION . --no-cache
