#!/bin/bash

NAME=athena-eric
DOCKER_FILE=../../.docker/athena/eric/Dockerfile.prod
VERSION=latest

aws configure set default.region us-east-1

# Authenticate against our Docker registry
aws --profile sema-terraform ecr get-login-password | docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com
# Build and push the image
echo "Building image..."
docker build -f $DOCKER_FILE -t $NAME:$VERSION .
# docker run --rm $NAME:$VERSION
# echo "Tagging image..."
docker tag $NAME:$VERSION 091235034633.dkr.ecr.us-east-1.amazonaws.com/$NAME:$VERSION
# echo "Pushing image..."
docker push 091235034633.dkr.ecr.us-east-1.amazonaws.com/$NAME:$VERSION