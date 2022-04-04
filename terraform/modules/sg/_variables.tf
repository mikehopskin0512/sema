variable "name_prefix" {
  type        = string
  description = "Name prefix for security group."
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
    error_message = "VPC id must not be empty."
  }
}
