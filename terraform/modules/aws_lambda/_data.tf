data "aws_caller_identity" "this" {}
data "aws_region" "this" {}

data "aws_iam_policy_document" "this" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "cloudwatch" {
  statement {
    actions   = ["logs:CreateLogStream"]
    resources = ["${aws_cloudwatch_log_group.this.arn}:*"]
  }

  statement {
    actions   = ["logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.this.arn}:log-stream:*"]
  }

  statement {
    actions   = ["logs:DescribeLogGroups"]
    resources = ["arn:aws:logs:${data.aws_region.this.name}:${data.aws_caller_identity.this.account_id}:log-group:*"]
  }

  dynamic "statement" {
    for_each = local.cloudwatch_logs_encrypted ? [true] : []
    content {
      actions = [
        "kms:DescribeKey",
        "kms:GenerateDataKey",
        "kms:Encrypt"
      ]
      resources = [var.cloudwatch_kms_key]
    }
  }
}

data "aws_iam_policy_document" "vpc" {
  statement {
    actions = [
      "ec2:DescribeNetworkInterfaces",
      "ec2:CreateNetworkInterface",
      "ec2:DeleteNetworkInterface"
    ]
    resources = ["*"]
  }
}

data "archive_file" "function" {
  type        = "zip"
  source_file = var.lambda_function_src
  output_path = local.lambda_function_zip
}
