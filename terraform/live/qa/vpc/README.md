# prod VPC

Putting this here in case we need it in the future - how to create a peering connection

# # ---------------------------------------------------------------------------------------------------------------------

# # CREATE THE PEERING CONNECTION TO US-EAST-2 (VPN) VPC

# # ---------------------------------------------------------------------------------------------------------------------

# resource "aws_vpc_peering_connection" "pc" {

# peer_vpc_id = "vpc-03eb634f0651b5fb8"

# vpc_id = module.prod_vpc.vpc_id

# peer_region = "us-east-2"

# # Important: these need to be set manually since peer is in another region

# # accepter {

# # allow_remote_vpc_dns_resolution = true

# # }

# # requester {

# # allow_remote_vpc_dns_resolution = true

# # }

# tags = {

# Name = "vpc-prod-vpn"

# }

# }

# ---------------------------------------------------------------------------------------------------------------------

# CREATE THE ROUTE TABLE ENTRIES FOR THE PEERED CONNECTION

# ---------------------------------------------------------------------------------------------------------------------

# resource "aws_route" "private" {

# count = 3

# # IDs of private route tables.

# route_table_id = element(module.prod_vpc.private_route_tables, count.index)

# # CIDR block / IP range for VPC 2.

# destination_cidr_block = "10.0.0.0/20"

# # ID of VPC peering connection.

# vpc_peering_connection_id = aws_vpc_peering_connection.pc.id

# }

# resource "aws_route" "public" {

# # ID of public route table.

# route_table_id = module.prod_vpc.public_route_table

# # CIDR block for VPC 2.

# destination_cidr_block = "10.0.0.0/20"

# # ID of VPC peering connection.

# vpc_peering_connection_id = aws_vpc_peering_connection.pc.id

# }

# resource "aws_route" "vpc" {

# # ID of VPC main route table.

# route_table_id = module.prod_vpc.vpc_route_table

# # CIDR block for VPC 2.

# destination_cidr_block = "10.0.0.0/20"

# # ID of VPC peering connection.

# vpc_peering_connection_id = aws_vpc_peering_connection.pc.id

# }

# # ---------------------------------------------------------------------------------------------------------------------

# # CREATE THE PEERING CONNECTION TO US-EAST-2 (DEFAULT) VPC...THIS IS WHERE PROD AND prod SMP LIVE

# # ---------------------------------------------------------------------------------------------------------------------

# resource "aws_vpc_peering_connection" "smp" {

# peer_vpc_id = "vpc-d75be4bf"

# vpc_id = module.prod_vpc.vpc_id

# peer_region = "us-east-2"

# # Important: these need to be set manually since peer is in another region

# # accepter {

# # allow_remote_vpc_dns_resolution = true

# # }

# # requester {

# # allow_remote_vpc_dns_resolution = true

# # }

# tags = {

# Name = "vpc-prod-smp"

# }

# }

# ---------------------------------------------------------------------------------------------------------------------

# CREATE THE ROUTE TABLE ENTRIES FOR THE PEERED CONNECTION

# ---------------------------------------------------------------------------------------------------------------------

# resource "aws_route" "private_smp" {

# count = 3

# # IDs of private route tables.

# route_table_id = element(module.prod_vpc.private_route_tables, count.index)

# # CIDR block / IP range for VPC 2.

# destination_cidr_block = "172.31.0.0/16"

# # ID of VPC peering connection.

# vpc_peering_connection_id = aws_vpc_peering_connection.smp.id

# }

# resource "aws_route" "public_smp" {

# # ID of public route table.

# route_table_id = module.prod_vpc.public_route_table

# # CIDR block for VPC 2.

# destination_cidr_block = "172.31.0.0/16"

# # ID of VPC peering connection.

# vpc_peering_connection_id = aws_vpc_peering_connection.smp.id

# }

# resource "aws_route" "vpc_smp" {

# # ID of VPC main route table.

# route_table_id = module.prod_vpc.vpc_route_table

# # CIDR block for VPC 2.

# destination_cidr_block = "172.31.0.0/16"

# # ID of VPC peering connection.

# vpc_peering_connection_id = aws_vpc_peering_connection.smp.id

# }
