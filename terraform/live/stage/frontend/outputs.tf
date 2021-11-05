output "secrets" {
  value = jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.phoenix.secret_string))
}
