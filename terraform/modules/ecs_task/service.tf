resource "aws_ecs_service" "this" {
  name                              = local.service
  task_definition                   = "${aws_ecs_task_definition.this.id}:${aws_ecs_task_definition.this.revision}"
  cluster                           = var.ecs_cluster.arn
  health_check_grace_period_seconds = 0
  launch_type                       = local.requires_compatibilities[0]
  enable_execute_command            = true

  network_configuration {
    assign_public_ip = false
    security_groups  = [aws_security_group.this.id]
    subnets          = var.subnets
  }

  dynamic "load_balancer" {
    for_each = local.ecs_external_access_enabled ? [true] : []
    content {
      target_group_arn = aws_lb_target_group.service["created"].arn
      container_name   = var.application
      container_port   = var.ecs_external_access.port
    }
  }

  tags = local.service_tags

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}
