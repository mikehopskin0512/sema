#!/bin/bash
NAME=apollo
ENV=qa1

ECR_URL=091235034633.dkr.ecr.us-east-1.amazonaws.com
CLUSTER_NAME=$ENV-frontend
TASK_FAMILY_NAME=$ENV-$NAME

NODE_ENV=staging
DOCKER_FILE=../.docker/apollo/Dockerfile.prod
BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
SHA1=$(git rev-parse HEAD)
VERSION=$BRANCH-$SHA1-$NODE_ENV

IMAGE=$ECR_URL/$NAME:$VERSION

aws configure set default.region us-east-1

# Authenticate against our Docker registry
aws --profile phoenix ecr get-login-password | sudo docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com
# Build and push the image
echo "Building image..."
sudo docker build -f $DOCKER_FILE -t $NAME:$VERSION . --no-cache
#docker build -t $NAME:$VERSION .
echo "Tagging image..."
sudo docker tag $NAME:$VERSION $IMAGE
echo "Pushing image..."
sudo docker push $IMAGE

echo "creating new task definition with image..."
# get the latest task definition
LATEST_TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition $TASK_FAMILY_NAME)
# update the first container in the containerDefinitions with the new image
# remove unallowed values received from latest task defintion for new task creation
# we only have 1 container per task definition currently
NEW_TASK_DEFINITION=$(echo $LATEST_TASK_DEFINITION | jq ".taskDefinition.containerDefinitions[0].image = \"$IMAGE\" | del(.taskDefinition.taskDefinitionArn, .taskDefinition.revision, .taskDefinition.status, .taskDefinition.requiresAttributes, .taskDefinition.compatibilities) | .taskDefinition")
# register the new task definition
NEW_TASK_DEFINITION_ARN=$(aws ecs register-task-definition --cli-input-json "$NEW_TASK_DEFINITION" | jq -r ".taskDefinition.taskDefinitionArn")

echo "Updating ECS with new task definition..."
# force update to use new task definition and redeploy
aws --profile phoenix ecs update-service --force-new-deployment --cluster $CLUSTER_NAME --service $NAME --task-definition $NEW_TASK_DEFINITION_ARN > /dev/null

echo "done :)"
