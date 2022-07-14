data "aws_iam_policy_document" "s3" {
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
      "arn:aws:s3:::${local.s3_name}/*",
    ]
  }

  statement {
    sid = "PutObject"
    principals {
      type        = "AWS"
      identifiers = var.publisher_arns
    }
    effect = "Allow"
    actions = [
      "s3:PutObject"
    ]
    resources = [
      "arn:aws:s3:::${local.s3_name}/*",
    ]
  }
}
