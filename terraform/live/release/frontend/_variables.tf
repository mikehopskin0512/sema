variable "phoenix_image" {
  type        = string
  description = "docker image to be used for phoenix/web; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:release-2022-06-15-37c2b7c9a9c8f1822732bccce189bffe669f5312-production"
}
variable "apollo_image" {
  type        = string
  description = "docker image to be used for apollo/api; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:release-2022-06-15-37c2b7c9a9c8f1822732bccce189bffe669f5312-production"
}
variable "apollo_worker_image" {
  type        = string
  description = "docker image to be used for apollo/api; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:prod"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo-worker:DVPS-304-29a4574c825cdc1d731baef9695cc5e495539827-production"
}
