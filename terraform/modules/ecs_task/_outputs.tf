output "name" {
  description = "ECS service name."
  value       = aws_ecs_service.this.name
}

output "sg" {
  description = "ECS service security group id."
  value       = aws_security_group.this.id
}
