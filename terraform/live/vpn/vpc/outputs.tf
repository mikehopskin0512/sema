output "vpc_cidr" {
  value = module.vpn_vpc.vpc_cidr
}

output "public_route_table" {
  value = module.vpn_vpc.public_route_table
}

output "vpc_id" {
  value = module.vpn_vpc.vpc_name
}
