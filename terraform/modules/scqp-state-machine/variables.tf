variable "aws_region" {
  default = "us-east-2"
}

variable "env" {}

variable "cluster_arn" {
  description = "Cluster where the fargate task will be invoked"
}

variable "pipeline_name" {
  description = "The name we are giving the AWS Step function (state machine)"
}