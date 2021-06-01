output "vpc_cidr" {
  value = module.prod_vpc.vpc_cidr
}

output "vpc_id" {
  value = module.prod_vpc.vpc_name
}