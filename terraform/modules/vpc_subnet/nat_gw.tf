resource "aws_eip" "this" {
  count = local.nat_count
  vpc   = true
  tags  = element(local.eip_tags, count.index)
}

resource "aws_nat_gateway" "this" {
  count         = local.nat_count
  allocation_id = element(aws_eip.this.*.id, count.index)
  subnet_id     = element(var.nat_subnets, count.index)
  tags          = element(local.nat_tags, count.index)
}
