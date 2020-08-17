variable "env" {}

variable "instance_class" {
  default = "db.t3.medium"
}

variable "instance_count" {
  description = "Number of db instances to run in the cluster"
  default = 1
}

variable "name" {
  description = "The name we are giving the cluster"
}

resource "random_password" "password" {
  length  = 16
  special = false
}

variable "vpc_name" {
  description = "The name the vpc in which the db cluster is being created"
}