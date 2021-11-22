variable "auto_accept" {
  type        = bool
  description = "Accept the peering (both VPCs need to be in the same AWS account)."
  default     = true
}

variable "common_extra_tags" {
  type        = map(string)
  description = "A key - value list of tags, that is attached to all resources."
  default     = {}
}

variable "vpc_peering_extra_tags" {
  type        = map(string)
  description = "A key - value list of tags, that is attached to the vpc peering connection."
  default     = {}
}

variable "peer_region" {
  type        = string
  description = "A region in which is placed vpc for peering"
  default     = null
}

variable "main_region" {
  type        = string
  description = "A region in which is placed peered vpc"
  default     = null
}

variable "peer_name" {
  type        = string
  description = "There is vpc peering name"
  default     = null
}
