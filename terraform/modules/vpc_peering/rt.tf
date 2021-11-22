resource "aws_route" "vpc_route" {
  count                     = length(var.vpc_route_tables)
  provider                  = aws.main
  route_table_id            = element(var.vpc_route_tables, count.index)
  destination_cidr_block    = data.aws_vpc.peer_vpc.cidr_block
  vpc_peering_connection_id = aws_vpc_peering_connection.this.id
}

resource "aws_route" "peer_vpc_route" {
  provider                  = aws.peer
  for_each                  = data.aws_route_tables.peer_vpc_rtb.ids
  route_table_id            = each.value
  destination_cidr_block    = data.aws_vpc.vpc.cidr_block
  vpc_peering_connection_id = aws_vpc_peering_connection.this.id
}
