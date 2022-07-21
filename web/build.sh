#!/bin/bash
set -euo pipefail
readonly NAME=phoenix
readonly ENV="${1}"
readonly BRANCH="${2}"
readonly AWS_ACCOUNT="091235034633"
readonly AWS_REGION="us-east-1"

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
ECR_URL="${AWS_ACCOUNT}".dkr.ecr."${AWS_REGION}".amazonaws.com
IMAGE=$ECR_URL/$NAME:$VERSION

cp .env.$ENV .env

# copy temp dir
if [ -d ../adonis ]; then
    cp -r ../adonis ./adonis
fi

aws configure set default.region "${AWS_REGION}"
# Authenticate against our Docker registry
aws ecr get-login-password | docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com

# Build and push the image
echo "Building image..."
docker build -f $DOCKER_FILE -t $NAME:$VERSION . --no-cache
echo "Tagging image..."
docker tag $NAME:$VERSION $IMAGE
echo "Pushing image..."
docker push $IMAGE
echo "Delete image..."
docker rmi $IMAGE
docker rmi $NAME:$VERSION
docker rmi $(docker images -f "dangling=true" -q)
