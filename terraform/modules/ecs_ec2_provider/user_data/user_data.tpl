#!/bin/bash
sudo start ecs
sudo service docker start

echo ECS_CLUSTER=${ecs_cluster_name} >>/etc/ecs/ecs.config
echo ECS_BACKEND_HOST= >>/etc/ecs/ecs.config
echo ECS_ENABLE_GPU_SUPPORT=true >>/etc/ecs/ecs.config
