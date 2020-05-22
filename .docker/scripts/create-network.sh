#!/usr/bin/env bash

set -e
set -o pipefail

DEFAULT_DOCKER_NETWORK='sema'

if [[ -z "$(docker network ls | grep "${DEFAULT_DOCKER_NETWORK}")" ]]; then
  docker network create "${DEFAULT_DOCKER_NETWORK}"
fi
