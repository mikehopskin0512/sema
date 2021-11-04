resource "aws_route_table" "this" {
  count  = local.route_table_count
  vpc_id = data.aws_vpc.this.id
  tags   = element(local.rt_tags, count.index)
}

resource "aws_route" "private" {
  count                  = local.nat_count
  route_table_id         = element(aws_route_table.this.*.id, count.index)
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = element(aws_nat_gateway.this.*.id, count.index)
}

resource "aws_route" "public" {
  count                  = local.internet_gw_count
  route_table_id         = element(aws_route_table.this.*.id, count.index)
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = element(aws_internet_gateway.this.*.id, count.index)
}

resource "aws_route_table_association" "this" {
  count          = local.subnets_count
  subnet_id      = element(aws_subnet.this.*.id, count.index)
  route_table_id = element(aws_route_table.this.*.id, count.index % local.route_table_count)
}
