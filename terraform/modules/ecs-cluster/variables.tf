variable "env" {}

variable "app_image" {
  description = "Docker image to run in the ECS cluster"
}

variable "app_port" {
  description = "Port exposed by the docker image to redirect traffic to"
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
}

variable "aws_region" {
  description = "The AWS region things are created in"
}

variable "cluster_name" {
  description = "The name we are giving the cluster"
}

variable "health_check_path" {
  default = "/login"
}

variable "vpc_name" {
  description = "The name the vpc in which the cluster is being created"
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default = 3
}

variable "app_count" {
  description = "Number of docker containers to run"
  default     = 3
}
