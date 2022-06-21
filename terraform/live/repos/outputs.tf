output "phoenix_web_repo_arn" {
  value       = aws_ecr_repository.phoenix.arn
  description = "There is arn for pushing frontend images"
}

output "apollo_web_repo_arn" {
  value       = aws_ecr_repository.apollo.arn
  description = "There is arn for pushing backend images"
}

output "apollo_worker_web_repo_arn" {
  value       = aws_ecr_repository.apollo_worker.arn
  description = "There is arn for pushing backend images"
}

output "hephaestus_web_repo_arn" {
  value       = aws_ecr_repository.hephaestus.arn
  description = "There is arn for pushing backend images"
}
