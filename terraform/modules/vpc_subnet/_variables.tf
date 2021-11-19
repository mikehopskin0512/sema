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
  description = "VPC id."
  validation {
    condition     = length(compact([null, "", var.vpc_id])) > 0
    error_message = "VPC id must not be empty."
  }
}

variable "cidr_suffix" {
  type        = number
  description = "Suffix that is used in subnet CIDR masks."
}
