#!/bin/bash
set -euo pipefail
readonly NAME="apollo"
readonly ENV="${1}"
readonly AWS_ACCOUNT="091235034633"
readonly AWS_REGION="us-east-1"

if [[ -z ${ENV} ]]; then
  printf "environment name (prod,qa etc) must me specified, e.g. ./build-and-deploy.sh qa \n"
  exit 1
fi

ECR_URL="${AWS_ACCOUNT}".dkr.ecr."${AWS_REGION}".amazonaws.com
CLUSTER_NAME=$ENV-frontend
TASK_FAMILY_NAME=$ENV-$NAME

NODE_ENV=production
DOCKER_FILE=../.docker/"${NAME}"/Dockerfile.prod
BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
SHA1=$(git rev-parse HEAD)
VERSION=$BRANCH-$SHA1-$NODE_ENV

rm -f .env

IMAGE=$ECR_URL/$NAME:$VERSION

aws configure set default.region "${AWS_REGION}"

# Authenticate against our Docker registry
aws --profile phoenix ecr get-login-password | docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com
# Build and push the image
echo "Building image..."
docker build -f $DOCKER_FILE -t $NAME:$VERSION . --no-cache
#docker build -t $NAME:$VERSION .
echo "Tagging image..."
docker tag $NAME:$VERSION $IMAGE
echo "Pushing image..."
docker push $IMAGE

echo "creating new task definition with image..."
# get the latest task definition
LATEST_TASK_DEFINITION=$(aws --profile phoenix ecs describe-task-definition --task-definition $TASK_FAMILY_NAME)
# update the first container in the containerDefinitions with the new image
# remove unallowed values received from latest task defintion for new task creation
# we only have 1 container per task definition currently
NEW_TASK_DEFINITION=$(echo $LATEST_TASK_DEFINITION | jq ".taskDefinition.containerDefinitions[0].image = \"$IMAGE\" | del(.taskDefinition.registeredAt, .taskDefinition.registeredBy, .taskDefinition.taskDefinitionArn, .taskDefinition.revision, .taskDefinition.status, .taskDefinition.requiresAttributes, .taskDefinition.compatibilities) | .taskDefinition")
# register the new task definition
NEW_TASK_DEFINITION_ARN=$(aws --profile phoenix ecs register-task-definition --cli-input-json "$NEW_TASK_DEFINITION" | jq -r ".taskDefinition.taskDefinitionArn")

echo "Updating ECS with new task definition..."
# force update to use new task definition and redeploy
aws --profile phoenix ecs update-service --force-new-deployment --cluster $CLUSTER_NAME --service $NAME --task-definition $NEW_TASK_DEFINITION_ARN > /dev/null

echo "done :)"
