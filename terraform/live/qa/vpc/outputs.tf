output "pc_qa_to_prod" {
  value = aws_vpc_peering_connection.qa_to_prod.id
}

output "vpc_cidr" {
  value = module.qa_vpc.vpc_cidr
}
