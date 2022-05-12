variable "phoenix_image" {
  type        = string
  description = "docker image to be used for phoenix/web; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:qa1-2daa2e1d5a4c9ac28f86419fb00d87ff81fdf8db-production"
}
variable "apollo_image" {
  type        = string
  description = "docker image to be used for apollo/api; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:qa1-2daa2e1d5a4c9ac28f86419fb00d87ff81fdf8db-production"
}
