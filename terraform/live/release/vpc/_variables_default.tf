#######
# VPC #
#######

variable "vpc_enable_dns_support" {
  type        = bool
  description = "Should DNS support be enabled for VPC?"
  default     = true
}

variable "vpc_enable_dns_hostnames" {
  type        = bool
  description = "Should DNS hostnames support be enabled for VPC?"
  default     = true
}

variable "vpc_subnet_private_suffix" {
  type        = number
  description = "Suffix that is used in private subnet CIDR masks."
  default     = 0
  validation {
    condition     = var.vpc_subnet_private_suffix != null
    error_message = "VPC private subnet suffix must not be empty."
  }
}

variable "vpc_subnet_public_suffix" {
  type        = number
  description = "Suffix that is used in public subnet CIDR masks."
  default     = 100
  validation {
    condition     = var.vpc_subnet_public_suffix != null
    error_message = "VPC public subnet suffix must not be empty."
  }
}

variable "vpc_cidr" {
  type        = string
  description = "VPC IP CIDR map."
  default     = "10.30.0.0/16"
  validation {
    condition     = length(compact([null, "", var.vpc_cidr])) > 0
    error_message = "VPC cidr must not be empty."
  }
}

###########
# Tagging #
###########

variable "vpc_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to VPC."
  default     = {}
}

variable "common_tags" {
  type        = map(string)
  description = "A key - value list of common tags, that is attached to the all resources"
  default = {
    "environment"  = "release",
    "organization" = "sema",
    "project"      = "phoenix",
    "terraform"    = "true"
  }
}

##########
# Common #
##########

variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  default     = "release"
  validation {
    condition     = length(compact([null, "", var.name_prefix])) > 0
    error_message = "Name prefix must not be empty."
  }
}

variable "aws_profile" {
  type        = string
  description = "A name of aws profile for provider"
  default     = "sema-terraform"
}
