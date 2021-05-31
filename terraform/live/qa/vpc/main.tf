module "qa_vpc" {
  source     = "../../../modules/vpc"
  cidr_block = "10.1.0.0/16"
  env        = "qa"
  az_count   = 3
}

resource "aws_vpc_peering_connection" "qa_to_prod" {
  peer_vpc_id = "vpc-0d3d9ce7ce46f98dc" #prod VPC ID
  vpc_id      = module.qa_vpc.vpc_name

  accepter {
    allow_remote_vpc_dns_resolution = true
  }

  requester {
    allow_remote_vpc_dns_resolution = true
  }

  tags = {
    Name      = "vpc-${var.env}-qa_to_prod"
    Env       = var.env
    Terraform = true
  }
}

resource "aws_route" "qa_public_rt" {
  route_table_id            = module.qa_vpc.public_route_table
  destination_cidr_block    = "10.2.0.0/16"
  vpc_peering_connection_id = aws_vpc_peering_connection.qa_to_prod.id
  depends_on                = [module.qa_vpc.public_route_table]
}

resource "aws_route" "prod_public_rt" {
  route_table_id            = "rtb-0070424b423f6930e" #prod public rt
  destination_cidr_block    = "10.1.0.0/16"
  vpc_peering_connection_id = aws_vpc_peering_connection.qa_to_prod.id
}

# Not Needed as 10.1.3.0/24 CIDR already present
resource "aws_security_group_rule" "prod_doc_sg" {
  type              = "ingress"
  description       = "qa jumphost access"
  protocol          = "tcp"
  from_port         = 27017
  to_port           = 27017
  cidr_blocks       = ["10.1.3.25/32"]
  security_group_id = "sg-05a95690052b84043" #prod DocDB sg
}