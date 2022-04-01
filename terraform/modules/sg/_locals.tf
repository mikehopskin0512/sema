locals {
  security_group = "${var.name_prefix}-sg"
}

locals {
  tags = merge(
    {
      "Name" = local.security_group
    },
    var.tags
  )
}
