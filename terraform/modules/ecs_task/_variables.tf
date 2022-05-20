variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  validation {
    condition     = length(compact([null, "", var.name_prefix])) > 0
    error_message = "Name prefix must not be empty."
  }
}

variable "application" {
  type        = string
  description = "Task definition container name."
  validation {
    condition     = length(compact([null, "", var.application])) > 0
    error_message = "Application variable must not be empty."
  }
}

variable "vpc_id" {
  type        = string
  description = "VPC where ecs task apps are running."
  validation {
    condition     = length(compact([null, "", var.vpc_id])) > 0
    error_message = "VPC id variable must not be empty."
  }
}

variable "subnets" {
  type        = list(string)
  description = "List of subnets where ecs task apps are running."
}

variable "ecs_cluster" {
  type = object({
    name = string
    arn  = string
  })
  description = "ECS cluster ARN where services are located."
}

variable "ecr_repo" {
  type = object({
    arn     = string
    kms_key = string
  })
  description = "ECS task ecr repository info."
  validation {
    condition     = var.ecr_repo != null
    error_message = "ECS task ecr repository info must not be empty."
  }
}

variable "image" {
  type        = string
  description = "ECR image tag."
  validation {
    condition     = length(compact([null, "", var.image])) > 0
    error_message = "ECR image tag must not be empty."
  }
}
variable "health_check_path" {
  type        = string
  description = "A path in the ecs for checking app health"
  default     = null
}

variable "ecs_external_access" {
  type = object({
    lb_listener_arn   = string
    port              = number
    lb_security_group = string
    domain            = string
    dns_zone_id       = string
    lb_domain         = string
    domain_prefix     = string
    lb_zone_id        = string
  })
  description = "Configuration parameters for allowing external access."
  default     = null
}
