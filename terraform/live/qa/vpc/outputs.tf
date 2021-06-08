output "vpc_cidr" {
  value = module.qa_vpc.vpc_cidr
}

output "public_route_table" {
  value = module.qa_vpc.public_route_table
}

output "vpc_id" {
  value = module.qa_vpc.vpc_name
}