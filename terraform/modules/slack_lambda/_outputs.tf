output "name" {
  description = "Lambda function name."
  value       = module.this.name
}

output "arn" {
  description = "Lambda function ARN."
  value       = module.this.arn
}
