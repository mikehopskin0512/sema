data "aws_vpc" "this" {
  tags = {
    Name = var.vpc_name
  }
}

data "aws_subnet_ids" "public" {
  vpc_id = data.aws_vpc.this.id
  tags = {
    Name = "*${var.name_prefix}*public*"
  }
}

data "aws_subnet_ids" "private" {
  vpc_id = data.aws_vpc.this.id
  tags = {
    Name = "*${var.name_prefix}*private*"
  }
}

data "terraform_remote_state" "repos" {
  backend = "s3"
  config = {
    bucket  = "sema-terraform"
    key     = "phoenix/ecr/terraform.tfstate"
    region  = "us-east-1"
    profile = "sema-terraform"
  }
}

data "aws_secretsmanager_secret_version" "phoenix" {
  secret_id = aws_secretsmanager_secret.phoenix.id
  depends_on = [
    aws_secretsmanager_secret_version.phoenix
  ]
}

data "aws_secretsmanager_secret_version" "apollo" {
  secret_id = aws_secretsmanager_secret.apollo.id
  depends_on = [
    aws_secretsmanager_secret_version.apollo
  ]
}
