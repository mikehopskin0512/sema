locals {
  hephaestus_summaries_secret = "${var.name_prefix}-hephaestus-summaries-secret"
  hephaestus_tags_secret      = "${var.name_prefix}-hephaestus-tags-secret"
}

locals {
  hephaestus_summaries_ecs_secrets = flatten([
    {
      envs      = keys(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.hephaestus_summaries.secret_string)))
      valueFrom = aws_secretsmanager_secret.hephaestus_summaries.arn
      kms       = try(aws_secretsmanager_secret.hephaestus_summaries.kms_key_id, null)
    }
  ])
  hephaestus_tags_ecs_secrets = flatten([
    {
      envs      = keys(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.hephaestus_tags.secret_string)))
      valueFrom = aws_secretsmanager_secret.hephaestus_tags.arn
      kms       = try(aws_secretsmanager_secret.hephaestus_tags.kms_key_id, null)
    }
  ])

  datadog_hephaestus_tags_api_key           = try(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.hephaestus_tags.secret_string))["DATADOG_API_KEY"], null)
  hephaestus_tags_ecs_secret_data_hash      = nonsensitive(sha256(data.aws_secretsmanager_secret_version.hephaestus_tags.secret_string))
  datadog_hephaestus_summaries_api_key      = try(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.hephaestus_summaries.secret_string))["DATADOG_API_KEY"], null)
  hephaestus_summaries_ecs_secret_data_hash = nonsensitive(sha256(data.aws_secretsmanager_secret_version.hephaestus_summaries.secret_string))

}
