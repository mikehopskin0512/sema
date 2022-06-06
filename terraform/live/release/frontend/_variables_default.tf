variable "vpc_name" {
  type        = string
  description = "The vpc name for other resources"
  default     = "vpc-release"
}

variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  default     = "release"
  validation {
    condition     = length(compact([null, "", var.name_prefix])) > 0
    error_message = "Name prefix must not be empty."
  }
}

variable "ecs_task_definition_resources_cpu" {
  type        = number
  description = "CPU limits for the task definition."
  default     = 1024
}

variable "ecs_task_definition_resources_memory" {
  type        = number
  description = "RAM limits for the task definition."
  default     = 2048
}

variable "aws_region" {
  type        = string
  description = "The AWS region things are created in"
  default     = "us-east-1"
}
