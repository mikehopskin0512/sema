#!/bin/bash
set -euo pipefail

readonly NAME="jaxon"
readonly VERSION="${1}"
readonly AWS_ACCOUNT="091235034633"
readonly AWS_REGION="us-east-1"

if [[ -z ${VERSION} ]]; then
    printf "environment name (prod,qa etc) must me specified, e.g. ./build-and-deploy.sh 1.3.1.1 \n"
    exit 1
fi

aws s3 cp s3://jaxon-models/ ./ --recursive

ECR_URL="${AWS_ACCOUNT}".dkr.ecr."${AWS_REGION}".amazonaws.com
DOCKER_FILE=../.docker/"${NAME}"/Dockerfile.prod
TAG="${VERSION}-with-models"

IMAGE=$ECR_URL/$NAME:$TAG

aws configure set default.region "${AWS_REGION}"

# Authenticate against our Docker registry
aws --profile phoenix ecr get-login-password | docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com
# Build and push the image
echo "Building image..."
docker build -f $DOCKER_FILE --build-arg VERSION=${VERSION} -t $NAME:$TAG . --no-cache
echo "Tagging image..."
docker tag $NAME:$TAG $IMAGE
echo "Pushing image..."
docker push $IMAGE

echo "done :)"
