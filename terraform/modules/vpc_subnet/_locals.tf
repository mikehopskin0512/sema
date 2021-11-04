locals {
  is_public     = length(var.nat_subnets) == 0 ? true : false
  subnet_prefix = regex("^[0-9]{1,3}\\.[0-9]{1,3}", data.aws_vpc.this.cidr_block)
  azs           = length(var.availability_zones) > 0 ? var.availability_zones : data.aws_availability_zones.this.names
  azs_count     = length(local.azs)
  subnets_count = var.subnets > 0 ? var.subnets : local.azs_count
}

locals {
  subnet_cidrs = [
    for num in range(local.subnets_count) :
    format("${local.subnet_prefix}.%d.0/24", num + 1 + var.cidr_suffix)
  ]
  subnet_azs = [
    for num in range(local.subnets_count) :
    element(local.azs, num % local.azs_count)
  ]
}

locals {
  internet_gw_count       = local.is_public ? 1 : 0
  nat_count               = local.is_public ? 0 : length(var.nat_subnets)
  route_table_count       = local.is_public ? 1 : local.nat_count
  map_public_ip_on_launch = local.is_public ? true : false
  status                  = local.is_public ? "public" : "private"
}

locals {
  igw_tags = merge(
    {
      "Name" = "${var.name_prefix}-igw"
    },
    var.igw_tags
  )
  eip_tags = [
    for num in range(local.nat_count) :
    merge(
      {
        "Name" = "${var.name_prefix}-nat-eip-${num}"
      },
      var.eip_tags
    )
  ]
  nat_tags = [
    for num in range(local.nat_count) :
    merge(
      {
        "Name" = "${var.name_prefix}-nat-${num}"
      },
      var.nat_tags
    )
  ]
  rt_tags = [
    for num in range(local.route_table_count) :
    merge(
      {
        "Name" = "${var.name_prefix}-rt-${local.status}-${num}"
      },
      var.rt_tags
    )
  ]
  subnet_tags = [
    for num in range(local.subnets_count) :
    merge(
      {
        "Name" = "${var.name_prefix}-subnet-${local.status}-${num}"
      },
      var.subnet_tags
    )
  ]
}
