# PXH-558 Allowing qa jumphost to connect prod DocDB
data "terraform_remote_state" "qa_vpc" {
  backend = "s3"
  config = {
    bucket  = "sema-terraform"
    key     = "phoenix/qa/vpc/terraform.tfstate"
    region  = "us-east-1"
    profile = "sema-terraform"
  }
}

data "terraform_remote_state" "prod_doc_db" {
  backend = "s3"
  config = {
    bucket  = "sema-terraform"
    key     = "phoenix/prod/document-db/terraform.tfstate"
    region  = "us-east-1"
    profile = "sema-terraform"
  }
}

resource "aws_route" "prod_public_rt" {
  route_table_id            = module.prod_vpc.public_route_table
  destination_cidr_block    = data.terraform_remote_state.qa_vpc.outputs.vpc_cidr
  vpc_peering_connection_id = data.terraform_remote_state.qa_vpc.outputs.pc_qa_to_prod
}

resource "aws_security_group_rule" "prod_doc_sg" {
  type              = "ingress"
  description       = "qa jumphost access"
  protocol          = "tcp"
  from_port         = 27017
  to_port           = 27017
  cidr_blocks       = ["10.1.3.25/32"] # qa jumbox ip
  security_group_id = data.terraform_remote_state.prod_doc_db.outputs.sg
}