variable "phoenix_image" {
  type        = string
  description = "docker image to be used for phoenix/web; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:master-027f1b0f0fc22fcbe6ccdd61aae0fdd0582a18e5-production"
}
variable "apollo_image" {
  type        = string
  description = "docker image to be used for apollo/api; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:master-027f1b0f0fc22fcbe6ccdd61aae0fdd0582a18e5-production"
}
