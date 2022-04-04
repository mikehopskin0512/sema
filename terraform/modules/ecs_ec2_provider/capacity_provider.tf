resource "aws_ecs_capacity_provider" "this" {
  name = local.capacity_provider_name

  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.this.arn
    managed_termination_protection = var.managed_termination_protection

    managed_scaling {
      status = var.managed_scaling
    }
  }

  depends_on = [
    aws_autoscaling_group.this
  ]
}

resource "aws_ecs_cluster_capacity_providers" "this" {
  cluster_name = var.ecs_cluster_name

  capacity_providers = ["FARGATE", local.capacity_provider_name]

  default_capacity_provider_strategy {
    base              = 0
    weight            = 0
    capacity_provider = "FARGATE"
  }

  depends_on = [
    aws_ecs_capacity_provider.this
  ]
}
