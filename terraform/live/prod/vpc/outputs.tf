output "vpc_cidr" {
  value = module.prod_vpc.vpc_cidr
}

output "vpc_id" {
  value = module.prod_vpc.vpc_name
}

output "public_route_table" {
  value = module.prod_vpc.public_route_table
}

output "private_route_table" {
  value = module.prod_vpc.private_route_table
}
