variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  validation {
    condition     = length(compact([null, "", var.name_prefix])) > 0
    error_message = "Name prefix must not be empty."
  }
}

variable "ecs_cluster_name" {
  type        = string
  description = "ECS cluster name."
}

variable "vpc_subnet_ids" {
  type        = list(string)
  description = "ID of the private subnet where to create ssm instance."
  validation {
    condition     = length(var.vpc_subnet_ids) > 0
    error_message = "Subnet ID must not be empty."
  }
}
