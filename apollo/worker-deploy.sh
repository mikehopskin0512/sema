#!/bin/bash
set -euo pipefail
readonly NAME="apollo-worker"
readonly ENV="${1}"
readonly BRANCH="${2}"
readonly AWS_ACCOUNT="091235034633"
readonly AWS_REGION="us-east-1"

if [[ -z ${ENV} || -z ${BRANCH} ]]; then
    printf "environment name and branch name (prod,qa etc) must me specified, e.g. ./worker-deploy.sh qa qa\n"
    exit 1
fi

ECR_URL="${AWS_ACCOUNT}".dkr.ecr."${AWS_REGION}".amazonaws.com
CLUSTER_NAME=$ENV-frontend
TASK_FAMILY_NAME=$ENV-$NAME

NODE_ENV=production
SHA1=$(git rev-parse HEAD)
VERSION=$BRANCH-$SHA1-$NODE_ENV

IMAGE=$ECR_URL/$NAME:$VERSION

# Authenticate against our Docker registry
aws ecr get-login-password | docker login --username AWS --password-stdin https://091235034633.dkr.ecr.us-east-1.amazonaws.com
echo "creating new task definition with image..."
# get the latest task definition
LATEST_TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition $TASK_FAMILY_NAME)
# update the first container in the containerDefinitions with the new image
# remove unallowed values received from latest task defintion for new task creation
# we only have 1 container per task definition currently
NEW_TASK_DEFINITION=$(echo $LATEST_TASK_DEFINITION | jq ".taskDefinition.containerDefinitions[0].image = \"$IMAGE\" | del(.taskDefinition.registeredAt, .taskDefinition.registeredBy, .taskDefinition.taskDefinitionArn, .taskDefinition.revision, .taskDefinition.status, .taskDefinition.requiresAttributes, .taskDefinition.compatibilities) | .taskDefinition")
# register the new task definition
NEW_TASK_DEFINITION_ARN=$(aws ecs register-task-definition --cli-input-json "$NEW_TASK_DEFINITION" | jq -r ".taskDefinition.taskDefinitionArn")

echo "Updating ECS with new task definition..."
# force update to use new task definition and redeploy
aws ecs update-service --force-new-deployment --cluster $CLUSTER_NAME --service $NAME --task-definition $NEW_TASK_DEFINITION_ARN >/dev/null

echo "done :)"
