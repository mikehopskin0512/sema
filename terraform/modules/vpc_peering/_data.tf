
data "aws_region" "this" {}

data "aws_vpc" "vpc" {
  id       = var.vpc_id
  provider = aws.main
}
data "aws_vpc" "peer_vpc" {
  provider = aws.peer
  id       = var.peer_vpc_id
}
data "aws_route_tables" "peer_vpc_rtb" {
  provider = aws.peer
  vpc_id   = var.peer_vpc_id
}


