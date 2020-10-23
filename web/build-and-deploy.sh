#!/bin/bash
CLUSTER_NAME=qa-frontend
SERVICE_NAME=phoenix

NAME=phoenix
# NODE_ENV=staging
DOCKER_FILE=../.docker/web/Dockerfile.prod
VERSION=latest
# BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
# SHA1=$(git rev-parse HEAD)
# VERSION=$BRANCH-$SHA1-$NODE_ENV

aws configure set default.region us-east-1

# Authenticate against our Docker registry
aws --profile sema-terraform ecr get-login-password | docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com
# Build and push the image
echo "Building image..."
docker build -f $DOCKER_FILE -t $NAME:$VERSION .
#docker build -t $NAME:$VERSION .
echo "Tagging image..."
docker tag $NAME:$VERSION 091235034633.dkr.ecr.us-east-1.amazonaws.com/$NAME:$VERSION
echo "Pushing image..."
docker push 091235034633.dkr.ecr.us-east-1.amazonaws.com/$NAME:$VERSION

echo "Updating ECS..."
aws --profile sema-terraform  ecs update-service --force-new-deployment --cluster $CLUSTER_NAME --service $SERVICE_NAME
