variable "phoenix_image" {
  type        = string
  description = "docker image to be used for phoenix/web; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:qa-858e0cb3b2c83a6076eb9aca79ee1ee2c5c0bd3d-production"
}
variable "apollo_image" {
  type        = string
  description = "docker image to be used for apollo/api; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:qa-858e0cb3b2c83a6076eb9aca79ee1ee2c5c0bd3d-production"
}
