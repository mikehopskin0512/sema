locals {
  alb            = "${var.name_prefix}-frontend"
  phoenix_secret = "${var.name_prefix}-phoenix-secret"
  apollo_secret  = "${var.name_prefix}-apollo-secret"
}

locals {
  phoenix_ecs_secrets = flatten([
    {
      envs      = keys(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.phoenix.secret_string)))
      valueFrom = aws_secretsmanager_secret.phoenix.arn
      kms       = try(aws_secretsmanager_secret.phoenix.kms_key_id, null)
    }
  ])
  apollo_ecs_secrets = flatten([
    {
      envs      = keys(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.apollo.secret_string)))
      valueFrom = aws_secretsmanager_secret.apollo.arn
      kms       = try(aws_secretsmanager_secret.apollo.kms_key_id, null)
    }
  ])

  datadog_apollo_api_key       = try(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.apollo.secret_string))["DATADOG_API_KEY"], null)
  datadog_phoenix_api_key      = try(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.phoenix.secret_string))["DATADOG_API_KEY"], null)
  phoenix_ecs_secret_data_hash = nonsensitive(sha256(data.aws_secretsmanager_secret_version.phoenix.secret_string))
  apollo_ecs_secret_data_hash  = nonsensitive(sha256(data.aws_secretsmanager_secret_version.apollo.secret_string))
}
