variable "batch_name" {
  description = "Name of the AWS Batch process"
}

variable "batch_policy_attachment" {
  description = "Allows step functions to submit jobs to batch"
}

variable "batch_service_role" {
  description = "IAM Role that batch runs under"
}

variable "efs_container_path" {
  description = "Path to mount host path on the docker container"
}

variable "efs_host_path" {
  description = "Path to mount efs on the host (ec2 instance)"
}

variable "env" {}

variable "image" {
  description = "Docker image to run in the batch job"
}

variable "instance_profile_role" {
  description = "Allows batch to trigger ECS to run ec2 instances"
}

variable "launch_template_id" {
  description = "ID of launch template to apply to batch instances"
}

variable "ssh_key" {
  description = "Ec2 Key pair used for instances launched in the compute environment"
}

variable "vpc_name" {
  description = "The name the vpc that the state machine is going to run in"
}
