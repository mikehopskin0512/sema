#!/bin/bash
ECR_URL=091235034633.dkr.ecr.us-east-1.amazonaws.com
ENV=qa1
CLUSTER_NAME=$ENV-frontend
SERVICE_NAME=apollo
TASK_FAMILY_NAME=$ENV-$SERVICE_NAME

NAME=apollo
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
# get the latest task definition ARN and execution role ARN
LATEST_TASK_DEFINITION_ARN=$(echo $LATEST_TASK_DEFINITION | jq -r ".taskDefinition.taskDefinitionArn")
LATEST_TASK_EXECUTION_ROLE_ARN=$(echo $LATEST_TASK_DEFINITION | jq -r ".taskDefinition.executionRoleArn")
# get the latest task definition excution ARN (needed for using secrets from the parameter store)
LATEST_TASK_EXECUTION_ROLE_ARN=$(echo $LATEST_TASK_DEFINITION | jq -r ".taskDefinition.executionRoleArn")
# update the first container in the containerDefinitions with the new image
# we only have 1 container per task definition currently
CONTAINER_DEFINITIONS=$(echo $LATEST_TASK_DEFINITION | jq ".taskDefinition.containerDefinitions[0].image = \"$IMAGE\" | .taskDefinition.containerDefinitions")
# register the new task definition
NEW_TASK_DEFINITION_ARN=$(aws ecs register-task-definition --family $TASK_FAMILY_NAME --container-definitions "$CONTAINER_DEFINITIONS" --execution-role-arn $LATEST_TASK_EXECUTION_ROLE_ARN | jq -r ".taskDefinition.taskDefinitionArn")

echo "making old task definition inactive..."
# de-register the old task definition
aws ecs deregister-task-definition --task-definition $LATEST_TASK_DEFINITION_ARN > /dev/null

# force update to use new task definition and redeploy
echo "Updating ECS with new task definition..."
aws --profile phoenix ecs update-service --force-new-deployment --cluster $CLUSTER_NAME --service $SERVICE_NAME --task-definition $NEW_TASK_DEFINITION_ARN > /dev/null

echo "done :)"
