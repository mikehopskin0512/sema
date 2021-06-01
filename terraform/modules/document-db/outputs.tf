output "pw" {
  sensitive = true
  value = random_password.password.result
}

output "sg" {
  value = aws_security_group.docdb.id
}