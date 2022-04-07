locals {
  hephaestus_secret = "${var.name_prefix}-hephaestus-secret"
}

locals {
  hephaestus_ecs_secrets = flatten([
    {
      envs      = keys(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.hephaestus.secret_string)))
      valueFrom = aws_secretsmanager_secret.hephaestus.arn
      kms       = try(aws_secretsmanager_secret.hephaestus.kms_key_id, null)
    }
  ])

  datadog_hephaestus_api_key      = try(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.hephaestus.secret_string))["DATADOG_API_KEY"], null)
  hephaestus_ecs_secret_data_hash = nonsensitive(sha256(data.aws_secretsmanager_secret_version.hephaestus.secret_string))

}
