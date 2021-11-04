resource "aws_internet_gateway" "this" {
  count  = local.internet_gw_count
  vpc_id = data.aws_vpc.this.id
  tags   = local.igw_tags

  depends_on = [
    aws_subnet.this
  ]
}
