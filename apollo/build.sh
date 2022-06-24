#!/bin/bash
set -euo pipefail
readonly NAME="apollo"
readonly ENV="${1}"
readonly BRANCH="${2}"
readonly AWS_ACCOUNT="091235034633"
readonly AWS_REGION="us-east-1"

if [[ -z ${ENV} || -z ${BRANCH} ]]; then
    printf "environment name and branch name (prod,qa etc) must me specified, e.g. ./build-and-deploy.sh qa qa\n"
    exit 1
fi

ECR_URL="${AWS_ACCOUNT}".dkr.ecr."${AWS_REGION}".amazonaws.com
NODE_ENV=production
DOCKER_FILE=../.docker/"${NAME}"/Dockerfile.prod

SHA1=$(git rev-parse HEAD)
VERSION=$BRANCH-$SHA1-$NODE_ENV

rm -f .env

IMAGE=$ECR_URL/$NAME:$VERSION

# Authenticate against our Docker registry
aws ecr get-login-password | docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com
# Build and push the image
echo "Building image..."
docker build -f $DOCKER_FILE -t $NAME:$VERSION . --no-cache
#docker build -t $NAME:$VERSION .
echo "Tagging image..."
docker tag $NAME:$VERSION $IMAGE
echo "Pushing image..."
docker push $IMAGE
echo "Delete image..."
docker rmi $IMAGE
docker rmi $NAME:$VERSION
