data "terraform_remote_state" "prod_vpc" {
  backend = "s3"
  config = {
    bucket  = "sema-terraform"
    key     = "phoenix/prod/vpc/terraform.tfstate"
    region  = "us-east-1"
    profile = "sema-terraform"
  }
}

resource "aws_vpc_peering_connection" "qa_to_prod" {
  #   peer_vpc_id = "vpc-0d3d9ce7ce46f98dc" #prod VPC ID
  peer_vpc_id = data.terraform_remote_state.prod_vpc.outputs.vpc_id
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
  destination_cidr_block    = data.terraform_remote_state.prod_vpc.outputs.vpc_cidr
  vpc_peering_connection_id = aws_vpc_peering_connection.qa_to_prod.id
  depends_on                = [module.qa_vpc.public_route_table]
}
