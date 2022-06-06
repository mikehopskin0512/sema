locals {
  vpc                 = "vpc-${var.name_prefix}"
  vpn_peering_prefix  = "${var.name_prefix}-vpn"
  scqp_peering_prefix = "${var.name_prefix}-scqp"
}

locals {

  vpc_tags = merge(
    {
      "Name" = local.vpc
    },
    var.vpc_tags
  )
}
