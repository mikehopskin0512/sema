output "pw" {
  sensitive = true
  value = random_password.password.result
}
