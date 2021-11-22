locals {
  vpc_peering = length(compact([null, "", var.peer_name])) > 0 ? var.peer_name : "${var.name_prefix}-vpc-peering"
}

locals {
  vpc_peering_tags = merge(
    {
      "Name" = local.vpc_peering
    },
    var.common_extra_tags,
    var.vpc_peering_extra_tags
  )
}

locals {
  peer_region = length(compact([null, "", var.peer_region])) > 0 ? var.peer_region : data.aws_region.this.name
  main_region = length(compact([null, "", var.main_region])) > 0 ? var.main_region : data.aws_region.this.name
}
