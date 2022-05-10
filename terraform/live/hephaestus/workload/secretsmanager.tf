resource "aws_secretsmanager_secret" "hephaestus_summaries" {
  name = local.hephaestus_summaries_secret
}

resource "aws_secretsmanager_secret_version" "hephaestus_summaries" {
  secret_id     = aws_secretsmanager_secret.hephaestus_summaries.id
  secret_string = jsonencode({})
}

resource "aws_secretsmanager_secret" "hephaestus_tags" {
  name = local.hephaestus_tags_secret
}

resource "aws_secretsmanager_secret_version" "hephaestus_tags" {
  secret_id     = aws_secretsmanager_secret.hephaestus_tags.id
  secret_string = jsonencode({})
}
