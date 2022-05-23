output "name" {
  description = "ECS service name."
  value       = aws_ecs_service.this.name
}

output "sg" {
  description = "ECS service security group id."
  value       = aws_security_group.this.id
}

output "execution_role_arn" {
  description = "ECS service execution role arn."
  value       = aws_iam_role.execution.arn
}

output "role_arn" {
  description = "ECS service role arn."
  value       = aws_iam_role.task.arn
}
