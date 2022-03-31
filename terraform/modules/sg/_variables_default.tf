variable "security_group_description" {
  type        = string
  description = "Description for security group"
  default     = "Security group from sg module"
}

#############
# Ingresses #
#############

variable "ingress_cidr_rules" {
  type = list(object({
    protocol  = string
    from_port = number
    to_port   = number
    entries   = list(string)
  }))
  description = "A list of objects, that describe ingress cidr blocks."
  default     = []
}

variable "ingress_ipv6_cidr_rules" {
  type = list(object({
    protocol  = string
    from_port = number
    to_port   = number
    entries   = list(string)
  }))
  description = "A list of objects, that describe ingress ipv6 cidr blocks."
  default     = []
}

variable "ingress_security_group_rules" {
  type = list(object({
    protocol  = string
    from_port = number
    to_port   = number
    entries   = string
  }))
  description = "A list of objects, that describe ingress security groups rules."
  default     = []
}

variable "ingress_self_rules" {
  type = list(object({
    protocol  = string
    from_port = number
    to_port   = number
  }))
  description = "A list of objects, that describe ingress self rules."
  default     = []
}

#############
# Egresses #
#############

variable "egress_cidr_rules" {
  type = list(object({
    protocol  = string
    from_port = number
    to_port   = number
    entries   = list(string)
  }))
  description = "A list of objects, that describe egress cidr blocks."
  default     = []
}

variable "egress_ipv6_cidr_rules" {
  type = list(object({
    protocol  = string
    from_port = number
    to_port   = number
    entries   = list(string)
  }))
  description = "A list of objects, that describe egress ipv6 cidr blocks."
  default     = []
}

variable "egress_security_group_rules" {
  type = list(object({
    protocol  = string
    from_port = number
    to_port   = number
    entries   = string
  }))
  description = "A list of objects, that describe egress security groups rules."
  default     = []
}

variable "egress_self_rules" {
  type = list(object({
    protocol  = string
    from_port = number
    to_port   = number
  }))
  description = "A list of objects, that describe egress self rules."
  default     = []
}

###########
# Tagging #
###########

variable "tags" {
  type        = map(string)
  description = "A key - value list of tags, that is attached to all resources."
  default     = {}
}
