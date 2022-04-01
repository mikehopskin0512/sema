resource "aws_security_group" "this" {
  name_prefix = local.security_group
  vpc_id      = var.vpc_id
  tags        = local.tags
  description = var.security_group_description

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "egress_cidr_rules" {
  type              = "egress"
  for_each          = { for egress in var.egress_cidr_rules : sha512(jsonencode(egress)) => egress }
  security_group_id = aws_security_group.this.id
  description       = var.security_group_description
  protocol          = each.value.protocol
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  cidr_blocks       = each.value.entries
}

resource "aws_security_group_rule" "egress_ipv6_cidr_rules" {
  type              = "egress"
  for_each          = { for egress in var.egress_ipv6_cidr_rules : sha512(jsonencode(egress)) => egress }
  security_group_id = aws_security_group.this.id
  description       = var.security_group_description
  protocol          = each.value.protocol
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  ipv6_cidr_blocks  = each.value.entries
}

resource "aws_security_group_rule" "egress_security_group_rules" {
  type                     = "egress"
  for_each                 = { for egress in var.egress_security_group_rules : sha512(jsonencode(egress)) => egress }
  security_group_id        = aws_security_group.this.id
  description              = var.security_group_description
  protocol                 = each.value.protocol
  from_port                = each.value.from_port
  to_port                  = each.value.to_port
  source_security_group_id = each.value.entries
}

resource "aws_security_group_rule" "egress_self_rules" {
  type              = "egress"
  for_each          = { for egress in var.egress_self_rules : sha512(jsonencode(egress)) => egress }
  security_group_id = aws_security_group.this.id
  description       = var.security_group_description
  protocol          = each.value.protocol
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  self              = true
}

resource "aws_security_group_rule" "ingress_self_rules" {
  type              = "ingress"
  for_each          = { for ingress in var.ingress_self_rules : sha512(jsonencode(ingress)) => ingress }
  security_group_id = aws_security_group.this.id
  description       = var.security_group_description
  protocol          = each.value.protocol
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  self              = true
}

resource "aws_security_group_rule" "ingress_security_group_rules" {
  type                     = "ingress"
  count                    = length(var.ingress_security_group_rules)
  security_group_id        = aws_security_group.this.id
  description              = var.security_group_description
  protocol                 = var.ingress_security_group_rules[count.index].protocol
  from_port                = var.ingress_security_group_rules[count.index].from_port
  to_port                  = var.ingress_security_group_rules[count.index].to_port
  source_security_group_id = var.ingress_security_group_rules[count.index].entries
}

resource "aws_security_group_rule" "ingress_ipv6_cidr_rules" {
  type              = "ingress"
  for_each          = { for ingress in var.ingress_ipv6_cidr_rules : sha512(jsonencode(ingress)) => ingress }
  security_group_id = aws_security_group.this.id
  description       = var.security_group_description
  protocol          = each.value.protocol
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  ipv6_cidr_blocks  = each.value.entries
}

resource "aws_security_group_rule" "ingress_cidr_rules" {
  type              = "ingress"
  for_each          = { for ingress in var.ingress_cidr_rules : sha512(jsonencode(ingress)) => ingress }
  security_group_id = aws_security_group.this.id
  description       = var.security_group_description
  protocol          = each.value.protocol
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  cidr_blocks       = each.value.entries
}
