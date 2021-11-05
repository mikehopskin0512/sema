variable "vpc_name" {
  type        = string
  description = "The vpc name for other resources"
  default     = "vpc-stage"
}

variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  default     = "stage"
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
