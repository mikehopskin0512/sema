
variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default = 3
}
variable "cidr_block" {
  description = "VPC CIDR block to use"
  default = "10.1.0.0/16"
}
variable "env" {}
