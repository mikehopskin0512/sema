variable "peer_vpc_id" {
  type        = string
  description = "A vpc id for peering"
}

variable "vpc_id" {
  type        = string
  description = "The main vpc id"
}

variable "vpc_route_tables" {
  type        = list(string)
  description = "A list of route tables ids"
}

variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  validation {
    condition     = length(compact([null, "", var.name_prefix])) > 0
    error_message = "Name prefix must not be empty."
  }
}

variable "aws_profile" {
  type        = string
  description = "A name of aws profile for provider"
  validation {
    condition     = length(compact([null, "", var.aws_profile])) > 0
    error_message = "Name of aws profile must not be empty."
  }
}
