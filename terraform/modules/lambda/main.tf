data "aws_vpc" "main" {
  tags = {
    Name = var.vpc_name
  }
}

# Fetch private subnets in the current region
data "aws_subnet_ids" "private" {
  vpc_id = data.aws_vpc.main.id
  tags = {
    Name = "vpc-${var.env}_private_*"
  }
}

data "aws_security_group" "private" {
  vpc_id = data.aws_vpc.main.id
  tags = {
    Name = "${var.env}-private-sg"
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# Create a new variable to hold the value of the source lambda directory.  If function_source_dir is passed in, then
# use it as the source; otherwise use the value passed in for function_name.  More often than not, function_name will
# be the value here.  This variable is needed for 1 specific use case: you may have a single source code directory
# from which you want to create multiple lambda functions.  For example, the lambda-proxy code is used to create
# 2 separate lambda functions.  In most cases, there will be a 1:1 relationship between code and lambda.
# ---------------------------------------------------------------------------------------------------------------------
locals {
  source = var.function_source_dir == "default_null" ? var.function_name : var.function_source_dir
}

# ---------------------------------------------------------------------------------------------------------------------
# LAMBDA ARCHIVE
# ---------------------------------------------------------------------------------------------------------------------

data "archive_file" "lambda_zip" {
  source_dir  = "${path.module}/functions/${local.source}"
  type        = "zip"
  output_path = "${path.module}/functions/dist/${var.env}-${var.function_name}.zip"
}

# ---------------------------------------------------------------------------------------------------------------------
# LAMBDA FUNCTION
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_lambda_function" "lambda_fn" {
  description      = var.function_description
  filename         = "${path.module}/functions/dist/${var.env}-${var.function_name}.zip"
  function_name    = "${var.env}-${var.function_name}"
  memory_size      = var.function_memory
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime          = "nodejs12.x"
  timeout          = var.function_timeout
  layers           = var.layers

  vpc_config {
    subnet_ids         = data.aws_subnet_ids.private.ids
    security_group_ids = [data.aws_security_group.private.id]
  }

  environment {
    variables = var.function_variables
  }
}