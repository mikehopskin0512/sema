resource "aws_vpc_peering_connection" "this" {
  peer_vpc_id = var.peer_vpc_id
  peer_region = var.peer_region
  vpc_id      = var.vpc_id
  auto_accept = false

  tags = local.vpc_peering_tags
}

resource "aws_vpc_peering_connection_accepter" "this" {
  provider                  = aws.peer
  vpc_peering_connection_id = aws_vpc_peering_connection.this.id
  auto_accept               = true

}
