variable "aws_region" {
  description = "The AWS region things are created in"
  default = "us-east-1"
}
variable "env" {
  description = "Name of the environment (qa, prod etc)"
  default = "qa"
}
