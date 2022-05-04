variable "vpc_name" {
  type        = string
  description = "The vpc name for other resources"
  default     = "vpc-hephaestus"
}

variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  default     = "hephaestus"
  validation {
    condition     = length(compact([null, "", var.name_prefix])) > 0
    error_message = "Name prefix must not be empty."
  }
}

variable "aws_region" {
  type        = string
  description = "The AWS region things are created in"
  default     = "us-east-1"
}

variable "ec2_capacity_provider_enabled" {
  type        = bool
  description = "Create ec2 provider for ecs cluster"
  default     = true
}

variable "ecs_task_definition_resources_cpu" {
  type        = number
  description = "CPU and RAM limits for the task definition."
  default     = 2048
}

variable "ecs_task_definition_resources_memory" {
  type        = number
  description = "CPU and RAM limits for the task definition."
  default     = 3900
}
