resource "aws_secretsmanager_secret" "hephaestus" {
  name = local.hephaestus_secret
}

resource "aws_secretsmanager_secret_version" "hephaestus" {
  secret_id     = aws_secretsmanager_secret.hephaestus.id
  secret_string = jsonencode({})
}