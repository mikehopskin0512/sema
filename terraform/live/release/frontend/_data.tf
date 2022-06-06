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

data "aws_iam_policy_document" "s3_scr_avatars" {
  statement {
    sid = "PublicReadGetObject"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    effect = "Allow"
    actions = [
      "s3:GetObject"
    ]

    resources = [
      "arn:aws:s3:::${local.s3_scr_avatars}/*",
    ]
  }

  statement {
    sid = "PutObject"
    principals {
      type = "AWS"
      identifiers = [
        module.phoenix.execution_role_arn,
        module.apollo.execution_role_arn
      ]
    }
    effect = "Allow"
    actions = [
      "s3:PutObject"
    ]
    resources = [
      "arn:aws:s3:::${local.s3_scr_avatars}/*",
    ]
  }
}
