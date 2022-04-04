resource "aws_autoscaling_group" "this" {
  name = local.ecs_autoscaling_group

  vpc_zone_identifier       = var.vpc_subnet_ids
  capacity_rebalance        = var.capacity_rebalance
  default_cooldown          = var.default_cooldown
  desired_capacity          = var.desired_capacity
  force_delete              = var.force_delete
  health_check_grace_period = var.health_check_grace_period
  health_check_type         = var.health_check_type
  launch_configuration      = aws_launch_configuration.this.name
  max_instance_lifetime     = var.max_instance_lifetime
  max_size                  = var.max_size
  min_size                  = var.min_size
  metrics_granularity       = var.metrics_granularity
  protect_from_scale_in     = var.protect_from_scale_in
  # placement_group           = aws_placement_group.this.id

  dynamic "tag" {
    for_each = local.autoscaling_tags
    content {
      key                 = tag.key
      propagate_at_launch = tag.value.propagate_at_launch
      value               = tag.value.value
    }
  }

  lifecycle {
    create_before_destroy = true
    ignore_changes = [
      desired_capacity
    ]
  }

}
