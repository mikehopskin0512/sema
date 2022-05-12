resource "aws_secretsmanager_secret" "phoenix" {
  name = local.phoenix_secret
}

resource "aws_secretsmanager_secret_version" "phoenix" {
  secret_id     = aws_secretsmanager_secret.phoenix.id
  secret_string = jsonencode({})
}

resource "aws_secretsmanager_secret" "apollo" {
  name = local.apollo_secret
}

resource "aws_secretsmanager_secret_version" "apollo" {
  secret_id     = aws_secretsmanager_secret.apollo.id
  secret_string = jsonencode({})
}

resource "aws_secretsmanager_secret" "apollo_worker" {
  name = local.apollo_worker_secret
}

resource "aws_secretsmanager_secret_version" "apollo_worker" {
  secret_id     = aws_secretsmanager_secret.apollo_worker.id
  secret_string = jsonencode({})
}
