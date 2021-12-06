locals {
  vpc = "vpc-${var.name_prefix}"
}

locals {

  vpc_tags = merge(
    {
      "Name" = local.vpc
    },
    var.vpc_tags
  )
}
