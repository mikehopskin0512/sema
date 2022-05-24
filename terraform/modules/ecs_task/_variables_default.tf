variable "task_count" {
  type        = number
  description = "Number of tasks running simultaneously."
  default     = 1
}
variable "requires_compatibilities_ec2_enabled" {
  type        = bool
  description = "Enables ec2 compatibilities for ecs task defenition"
  default     = false
}

variable "task_definition_resources_cpu" {
  type        = number
  description = "CPU and RAM limits for the task definition."
  default     = null
}

variable "task_definition_resources_memory" {
  type        = number
  description = "CPU and RAM limits for the task definition."
  default     = null
}

variable "ecs_command" {
  type        = list(string)
  description = "Redirect ECS container's command."
  default     = []
  validation {
    condition     = var.ecs_command != null
    error_message = "ECS container's command must not be null."
  }
}

variable "ecs_envs" {
  type = list(
    object({
      name  = string
      value = string
    })
  )
  description = "A list of env variables is set to ECS task."
  default     = []
}

variable "ecs_secrets" {
  type = list(
    object({
      envs      = list(string)
      valueFrom = string
      kms       = string
    })
  )
  description = "A list of secrets attached to ECS task."
  default     = []
}

variable "external_iam_policies" {
  type        = list(string)
  description = "A list of external IAM policies to attach to the ECS task."
  default     = []
}

variable "external_exec_iam_policies" {
  type        = list(string)
  description = "A list of external iam policies attached to ECS exec role."
  default     = []
}

###################
# Logging options #
###################

variable "cw_retention_in_days" {
  type        = number
  description = "Number of days is needed to retain log events in the log group."
  default     = 30
  validation {
    condition     = can(index([0, 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653], var.cw_retention_in_days))
    error_message = "Only [0, 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653] values are allowed for cw_retention_in_days variable."
  }
}

variable "cw_kms_key" {
  type        = string
  description = "The ARN of the KMS Key to use when encrypting log data."
  default     = null
  validation {
    condition     = var.cw_kms_key != ""
    error_message = "CloudWatch kms key id variable must not be an empty string."
  }
}

###########
# Tagging #
###########

variable "service_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to a service."
  default     = {}
}

variable "task_definition_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to a task definition."
  default     = {}
}

variable "cw_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to a cloudwatch log group."
  default     = {}
}

variable "sg_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to security group."
  default     = {}
}

variable "datadog_api_key" {
  type        = string
  description = "An API key for configuring forwarding logs to datadog"
  default     = null
  validation {
    condition     = var.datadog_api_key != ""
    error_message = "An datadog api key must not be empty."
  }
}

variable "sg_description" {
  type        = string
  description = "Security group description."
  default     = "Managed by Terraform"
}

variable "min_capacity" {
  type        = number
  description = "The min capacity of the scalable target."
  default     = 3
}

variable "max_capacity" {
  type        = number
  description = "The max capacity of the scalable target."
  default     = 6
}

variable "ecs_external_access_path_pattern" {
  type        = string
  description = "This is path pattern for load balancer rule"
  default     = null
}

variable "ecs_external_access_priority" {
  type        = number
  description = "This is a number of priority for load balancer rule"
  default     = null
}

variable "ephemeral_storage" {
  type        = number
  description = "This is a number of ephemeral storage size"
  default     = null
}

variable "gpu" {
  type        = string
  description = "Number of required gpu"
  default     = null
}
