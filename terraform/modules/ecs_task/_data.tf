data "aws_region" "current" {}
data "aws_caller_identity" "this" {}

data "aws_iam_policy_document" "ecr" {
  statement {
    actions = [
      "ecr:GetAuthorizationToken",
    ]
    resources = ["*"]
  }
  statement {
    actions = [
      "ecr:ListImages",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage"
    ]
    resources = [var.ecr_repo.arn]
  }
  dynamic "statement" {
    for_each = local.create_ecr_kms_policy ? [true] : []
    content {
      actions   = ["kms:Decrypt"]
      resources = [var.ecr_repo.kms_key]
    }
  }
}

data "aws_iam_policy_document" "cw" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["${aws_cloudwatch_log_group.this.arn}:*"]
  }
  dynamic "statement" {
    for_each = local.cw_logs_encrypted ? [true] : []
    content {
      actions = [
        "kms:DescribeKey",
        "kms:GenerateDataKey",
        "kms:Encrypt"
      ]
      resources = [var.cw_kms_key]
    }
  }
}

data "aws_iam_policy_document" "secret" {
  count = local.create_secret_policy ? 1 : 0
  dynamic "statement" {
    for_each = length(local.ssm_params_arns) > 0 ? [true] : []
    content {
      actions   = ["ssm:GetParameters"]
      resources = local.ssm_params_arns
    }
  }

  dynamic "statement" {
    for_each = length(local.secrets_manager_arns) > 0 ? [true] : []
    content {
      actions = [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ]
      resources = local.secrets_manager_arns
    }
  }

  dynamic "statement" {
    for_each = length(local.secrets_kms_arns) > 0 ? [true] : []
    content {
      actions   = ["kms:Decrypt"]
      resources = local.secrets_kms_arns
    }
  }
}
