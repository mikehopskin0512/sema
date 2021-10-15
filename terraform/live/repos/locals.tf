locals {
  all_repos_name = [
    aws_ecr_repository.apollo.name,
    aws_ecr_repository.phoenix.name,
    aws_ecr_repository.athena_ananke.name,
    aws_ecr_repository.athena_eric.name,
    aws_ecr_repository.athena_janus.name,
    aws_ecr_repository.athena_momus.name,
    aws_ecr_repository.athena_plutus.name,
  ]

  tag_prefix_list = "[\"${join("\", \"", var.tag_prefix_list)}\"]"
}
