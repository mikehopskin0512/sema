resource "aws_subnet" "this" {
  count                   = local.subnets_count
  vpc_id                  = data.aws_vpc.this.id
  cidr_block              = element(local.subnet_cidrs, count.index)
  availability_zone       = element(local.subnet_azs, count.index)
  map_public_ip_on_launch = local.map_public_ip_on_launch
  tags                    = element(local.subnet_tags, count.index)
}
