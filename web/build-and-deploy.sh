#!/bin/bash
CLUSTER_NAME=qa1-frontend
SERVICE_NAME=phoenix

NAME=phoenix
NODE_ENV=staging
DOCKER_FILE=../.docker/web/Dockerfile.prod
BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
SHA1=$(git rev-parse HEAD)
VERSION=$BRANCH-$SHA1-$NODE_ENV

aws configure set default.region us-east-1

# Authenticate against our Docker registry
aws --profile phoenix ecr get-login-password | sudo docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com
# Build and push the image
echo "Building image..."
sudo docker build -f $DOCKER_FILE -t $NAME:$VERSION . --no-cache
#docker build -t $NAME:$VERSION .
echo "Tagging image..."
sudo docker tag $NAME:$VERSION 091235034633.dkr.ecr.us-east-1.amazonaws.com/$NAME:$VERSION
echo "Pushing image..."
sudo docker push 091235034633.dkr.ecr.us-east-1.amazonaws.com/$NAME:$VERSION

echo "Updating ECS..."
aws --profile phoenix  ecs update-service --force-new-deployment --cluster $CLUSTER_NAME --service $SERVICE_NAME > /dev/null
