output "vpc_cidr" {
  description = "VPC cird block"
  value       = aws_vpc.this.cidr_block
}

output "vpc_id" {
  description = "VPC id"
  value       = aws_vpc.this.id
}

output "public_route_table" {
  description = "VPC public route table id"
  value       = module.vpc_subnet_public.rt_id
}

output "private_route_table" {
  description = "VPC private route table id"
  value       = module.vpc_subnet_private.rt_id
}
