#!/bin/bash
set -euo pipefail
readonly NAME=phoenix
readonly ENV="${1}"
readonly AWS_ACCOUNT="091235034633"
readonly AWS_REGION="us-east-1"

source branch.txt || true

if [[ -z ${BRANCH} ]]; then
    BRANCH="${2}"
fi

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
BASE_IMAGE=$ECR_URL/$NAME
IMAGE=$BASE_IMAGE:$VERSION
IMAGE_LATEST=$ECR_URL/$NAME:latest

cp .env.$ENV .env

# copy temp dir
if [ -d ../adonis ]; then
    cp -r ../adonis ./adonis
fi

aws configure set default.region "${AWS_REGION}"
# Authenticate against our Docker registry
aws ecr get-login-password | docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com

# build builder image
docker build \
    --target builder \
    --cache-from ${ECR_URL}/${NAME}:builder \
    -t ${ECR_URL}/${NAME}:builder \
    -f ${DOCKER_FILE} \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    .

# Build and push the image
echo "Building image..."
docker build --cache-from ${BASE_IMAGE}:builder,${IMAGE_LATEST} \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    -f $DOCKER_FILE -t $NAME:$VERSION .

echo "Tagging image..."
docker tag $NAME:$VERSION $IMAGE
docker tag $NAME:$VERSION $IMAGE_LATEST
echo "Pushing image..."
docker push $BASE_IMAGE --all-tags
echo "Delete image..."
docker rmi $IMAGE
docker rmi $NAME:$VERSION
