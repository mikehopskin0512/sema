variable "phoenix_image" {
  type        = string
  description = "docker image to be used for phoenix/web; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:master-6e120b215121d79ba3db31a1a41c120fb23ec25b-production"
}
variable "apollo_image" {
  type        = string
  description = "docker image to be used for apollo/api; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:master-6e120b215121d79ba3db31a1a41c120fb23ec25b-production"
}
variable "apollo_worker_image" {
  type        = string
  description = "docker image to be used for apollo/api; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:worker"
}
