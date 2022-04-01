variable "hephaestus_image" {
  type        = string
  description = "docker image to be used for hephaestus; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/hephaestus:1.3.1.1-with-models"
  default     = "091235034633.dkr.ecr.us-east-1.amazonaws.com/hephaestus:1.3.1.1-with-models"
}
