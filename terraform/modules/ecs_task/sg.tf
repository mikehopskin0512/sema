resource "aws_security_group" "this" {
  name        = local.sg
  vpc_id      = var.vpc_id
  description = var.sg_description

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  dynamic "ingress" {
    for_each = local.ecs_external_access_enabled ? [true] : []
    content {
      protocol        = "tcp"
      from_port       = var.ecs_external_access.port
      to_port         = var.ecs_external_access.port
      security_groups = [var.ecs_external_access.lb_security_group]
    }
  }

  tags = local.sg_tags
}
