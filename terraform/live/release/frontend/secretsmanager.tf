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
