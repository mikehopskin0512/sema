variable "vpc_name" {
  type        = string
  description = "The vpc name for other resources"
  default     = "vpc-staging"
}

variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  default     = "staging"
  validation {
    condition     = length(compact([null, "", var.name_prefix])) > 0
    error_message = "Name prefix must not be empty."
  }
}

variable "ecs_task_definition_resources" {
  type = object({
    cpu    = number
    memory = number
  })
  description = "CPU and RAM limits for the task definition."
  default = {
    cpu    = 1024
    memory = 2048
  }
}

variable "aws_region" {
  type        = string
  description = "The AWS region things are created in"
  default     = "us-east-1"
}
