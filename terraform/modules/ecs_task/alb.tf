resource "aws_lb_target_group" "service" {
  for_each    = local.ecs_external_access_enabled ? { "created" = "true" } : {}
  name        = "${var.name_prefix}-${var.application}"
  port        = var.ecs_external_access.port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = var.health_check_path
    unhealthy_threshold = "2"
  }
}

resource "aws_lb_listener_rule" "service_routing" {
  listener_arn = data.aws_lb_listener.https["created"].arn

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service["created"].arn
  }

  condition {
    host_header {
      values = [local.domain]
    }
  }
}
