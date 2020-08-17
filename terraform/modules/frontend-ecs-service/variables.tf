
variable "aws_region" {
  description = "The AWS region things are created in"
}

variable "cluster_name" {
  description = "The name we are giving the cluster"
}

variable "cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
}

variable "env" {}

variable "domain" {
  description = "Domain name that the LB will proxy to the target group"
  type = string
}

variable "health_check_path" {
  default = "/login"
}

variable "image" {
  description = "Docker image to run in the ECS cluster"
}

variable "lb_listener_arn" {
  description = "LB listener that will route traffic to the target group"
}

variable "lb_security_group" {
  description = "LB security group"
}

variable "memory" {
  description = "Fargate instance memory to provision (in MiB)"
}

variable "port" {
  description = "Port exposed by the docker image to redirect traffic to"
}

variable "service_name" {
  description = "The name we are giving the ecs service"
}

variable "task_count" {
  description = "Number of docker containers to run"
  default     = 3
}

variable "vpc_name" {
  description = "The name the vpc in which the cluster is being created"
}
