output "id" {
  description = "VPC sunbets ids."
  value       = aws_subnet.this.*.id
}

output "rt_id" {
  description = "VPC route tables ids."
  value       = aws_route_table.this.*.id
}
