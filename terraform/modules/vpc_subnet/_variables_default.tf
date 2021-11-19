variable "subnets" {
  type        = number
  description = "Override default subnet count. By default subnet count = number of azs in the current region."
  default     = 0
}

variable "availability_zones" {
  type        = list(string)
  description = "Override default az list. By default the module uses all availables azs in the current region."
  default     = []
}

variable "nat_subnets" {
  type        = list(string)
  description = "A list of public subnet ids that are used by NAT."
  default     = []
}

variable "igw_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to internet gateway."
  default     = {}
}

variable "eip_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to elastic ip."
  default     = {}
}

variable "nat_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to nat gateway."
  default     = {}
}

variable "rt_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to route tables."
  default     = {}
}

variable "subnet_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to subnets."
  default     = {}
}
