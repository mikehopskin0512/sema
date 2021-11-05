locals {
  alb            = "${var.name_prefix}-frontend"
  phoenix_secret = "${var.name_prefix}-phoenix-secret"
}

locals {
  ecs_secrets = flatten([
    {
      envs      = keys(jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.phoenix.secret_string)))
      valueFrom = aws_secretsmanager_secret.phoenix.arn
      kms       = try(aws_secretsmanager_secret.phoenix.kms_key_id, null)
    }
  ])
  ecs_secret_data_hash = nonsensitive(sha256(data.aws_secretsmanager_secret_version.phoenix.secret_string))
}
