output "auto_scaling_group_arn" {
  value = aws_autoscaling_group.this.arn
}

output "capacity_provider" {
  value = aws_ecs_capacity_provider.this.name
}

output "iam_role_name" {
  value = aws_iam_role.ec2.name
}
