variable "aws_region" {
  description = "The AWS region things are created in"
  default = "us-east-1"
}
variable "phoenix_image" {
  description = "docker image to be used for phoenix/web; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:prod"
}
variable "apollo_image" {
  description = "docker image to be used for apollo/api; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:prod"
}