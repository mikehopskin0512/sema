module "qa_vpc" {
  source = "../../../modules/vpc"
  cidr_block = "10.1.0.0/16"
  env = "qa"
  az_count = 3
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE THE PEERING CONNECTION TO US-EAST-2 (VPN) VPC
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_vpc_peering_connection" "pc" {
  peer_vpc_id   = "vpc-03eb634f0651b5fb8"
  vpc_id        = module.qa_vpc.vpc_id
  peer_region   = "us-east-2"

# Important: these need to be set manually since peer is in another region
#  accepter {
#    allow_remote_vpc_dns_resolution = true
#  }

#  requester {
#    allow_remote_vpc_dns_resolution = true
#  }

  tags = {
     Name = "vpc-qa-vpn"
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE THE ROUTE TABLE ENTRIES FOR THE PEERED CONNECTION
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_route" "private" {
  count = 3

  # IDs of private route tables.
  route_table_id = element(module.qa_vpc.private_route_tables, count.index)

  # CIDR block / IP range for VPC 2.
  destination_cidr_block = "10.0.0.0/20"

  # ID of VPC peering connection.
  vpc_peering_connection_id = aws_vpc_peering_connection.pc.id
}

resource "aws_route" "public" {

  # ID of public route table.
  route_table_id = module.qa_vpc.public_route_table

  # CIDR block for VPC 2.
  destination_cidr_block = "10.0.0.0/20"

  # ID of VPC peering connection.
  vpc_peering_connection_id = aws_vpc_peering_connection.pc.id
}

resource "aws_route" "vpc" {

  # ID of VPC main route table.
  route_table_id = module.qa_vpc.vpc_route_table

  # CIDR block for VPC 2.
  destination_cidr_block = "10.0.0.0/20"

  # ID of VPC peering connection.
  vpc_peering_connection_id = aws_vpc_peering_connection.pc.id
}
