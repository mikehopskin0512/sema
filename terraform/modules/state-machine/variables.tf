variable "batch_ssh_key" {
  description = "Ec2 Key pair used for instances launched in the compute environment"
}

variable "efs_access_point_name" {
  description = "Path to mount host path on the docker container"
}

variable "efs_host_path" {
  description = "Path to mount efs on the host (ec2 instance)"
}

variable "env" {}

variable "eric_image" {
  description = "Eric Docker image run by the Batch job"
}

variable "pipeline_name" {
  description = "The name we are giving the AWS Step function (state machine)"
}

variable "vpc_name" {
  description = "The name the vpc that the state machine is going to run in"
}
