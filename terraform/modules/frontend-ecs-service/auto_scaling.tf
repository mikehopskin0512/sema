
# ---------------------------------------------------------------------------------------------------------------------
# SERVICE AUTOSCALING GROUPS BASED ON CPU USAGE (SCALE UP/DOWN)
# ---------------------------------------------------------------------------------------------------------------------
resource "aws_appautoscaling_target" "service" {
  service_namespace  = "ecs"
  resource_id        = "service/${data.aws_ecs_cluster.main.cluster_name}/${aws_ecs_service.service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  min_capacity       = 3
  max_capacity       = 6
}

# Automatically scale capacity up by one
resource "aws_appautoscaling_policy" "service_out" {
  name               = "${var.env}-${var.service_name}_scale_out"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.service.resource_id
  scalable_dimension = aws_appautoscaling_target.service.scalable_dimension
  service_namespace  = aws_appautoscaling_target.service.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Maximum"

    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment          = 1
    }
  }

  depends_on = [aws_appautoscaling_target.service]
}

# Automatically scale capacity down by one
resource "aws_appautoscaling_policy" "service_in" {
  name               = "${var.env}-${var.service_name}_scale_in"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.service.resource_id
  scalable_dimension = aws_appautoscaling_target.service.scalable_dimension
  service_namespace  = aws_appautoscaling_target.service.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Maximum"

    step_adjustment {
      metric_interval_upper_bound = 0
      scaling_adjustment          = -1
    }
  }

  depends_on = [aws_appautoscaling_target.service]
}

# CloudWatch alarm that triggers the autoscaling up policy
resource "aws_cloudwatch_metric_alarm" "service_cpu_high" {
  alarm_name          = "${var.env}-${var.service_name}_cpu_utilization_high"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "85"

  dimensions = {
    ClusterName = data.aws_ecs_cluster.main.cluster_name
    ServiceName = aws_ecs_service.service.name
  }

  alarm_description = "This metric monitors ${var.env}-${var.service_name} autoscaling up policy"
  alarm_actions     = [aws_appautoscaling_policy.service_out.arn]
}

# CloudWatch alarm that triggers the autoscaling down policy
resource "aws_cloudwatch_metric_alarm" "service_cpu_low" {
  alarm_name          = "${var.env}-${var.service_name}_cpu_utilization_low"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "10"

  dimensions = {
    ClusterName = data.aws_ecs_cluster.main.cluster_name
    ServiceName = aws_ecs_service.service.name
  }

  alarm_description = "This metric monitors ${var.env}-${var.service_name} autoscaling down policy"
  alarm_actions = [aws_appautoscaling_policy.service_in.arn]
}
