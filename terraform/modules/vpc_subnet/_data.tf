data "aws_availability_zones" "this" {
  state = "available"
}

data "aws_vpc" "this" {
  id = var.vpc_id
}
