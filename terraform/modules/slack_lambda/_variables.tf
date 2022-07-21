variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  validation {
    condition     = length(compact([null, "", var.name_prefix])) > 0
    error_message = "Name prefix must not be empty."
  }
}

variable "vpc_id" {
  type        = string
  description = "VPC ID to attach to."
  validation {
    condition     = length(compact([null, "", var.vpc_id])) > 0
    error_message = "VPC ID must not be empty."
  }
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs where Lambda will be hosted."
  validation {
    condition     = length(var.subnet_ids) > 0
    error_message = "List of subnet IDs must not be empty."
  }
}

variable "slack_url" {
  type        = string
  description = "The url of slack namespace"
}

variable "slack_channel" {
  type        = string
  description = "The name of slack channel"
}

variable "slack_user" {
  type        = string
  description = "The name of slack user"
}
