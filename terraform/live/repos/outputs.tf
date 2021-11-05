output "phoenix_web_repo_url" {
  value       = aws_ecr_repository.phoenix.repository_url
  description = "There is URL for pushing frontend images"
}

output "phoenix_web_repo_arn" {
  value       = aws_ecr_repository.phoenix.arn
  description = "There is arn for pushing frontend images"
}

output "apollo_web_repo_url" {
  value       = aws_ecr_repository.apollo.repository_url
  description = "There is URL for pushing backend images"
}

output "apollo_web_repo_arn" {
  value       = aws_ecr_repository.apollo.arn
  description = "There is arn for pushing backend images"
}
