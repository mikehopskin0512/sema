#!/bin/bash
set -euo pipefail
readonly NAME="apollo-worker"
readonly ENV="${1}"
readonly AWS_ACCOUNT="091235034633"
readonly AWS_REGION="us-east-1"

source branch.txt || true

if [[ -z ${BRANCH} ]]; then
    BRANCH="${2}"
fi

if [[ -z ${ENV} || -z ${BRANCH} ]]; then
    printf "environment name and branch name (prod,qa etc) must me specified, e.g. ./worker-build.sh qa qa\n"
    exit 1
fi

ECR_URL="${AWS_ACCOUNT}".dkr.ecr."${AWS_REGION}".amazonaws.com
NODE_ENV=production
DOCKER_FILE=../.docker/"${NAME}"/Dockerfile.prod
BASE_IMAGE=$ECR_URL/$NAME
IMAGE=$BASE_IMAGE:$VERSION
IMAGE_LATEST=$ECR_URL/$NAME:latest
SHA1=$(git rev-parse HEAD)
VERSION=$BRANCH-$SHA1-$NODE_ENV

rm -f .env

IMAGE=$ECR_URL/$NAME:$VERSION

# Authenticate against our Docker registry
aws ecr get-login-password | docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com

# build builder image
docker build \
    --target builder \
    --cache-from ${ECR_URL}/${NAME}:builder \
    -t ${ECR_URL}/${NAME}:builder \
    -f ${DOCKER_FILE} \
    .

# Build and push the image
echo "Building image..."
DOCKER_BUILDKIT=1 docker build --cache-from ${BASE_IMAGE}:builder \
    --cache-from ${IMAGE_LATEST} \
    -f $DOCKER_FILE -t $NAME:$VERSION .
echo "Tagging image..."
docker tag $NAME:$VERSION $IMAGE
docker tag $NAME:$VERSION $IMAGE_LATEST
echo "Pushing image..."
docker push $IMAGE
echo "Delete image..."
docker rmi $IMAGE
docker rmi $NAME:$VERSION
