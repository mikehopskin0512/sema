resource "aws_iam_role" "this" {
  name               = local.lambda_function_role
  assume_role_policy = data.aws_iam_policy_document.this.json
}

resource "aws_iam_role_policy" "cloudwatch" {
  name   = local.lambda_function_cloudwatch_policy
  role   = aws_iam_role.this.name
  policy = data.aws_iam_policy_document.cloudwatch.json
}

resource "aws_iam_role_policy" "vpc" {
  name   = local.lambda_function_vpc_policy
  role   = aws_iam_role.this.name
  policy = data.aws_iam_policy_document.vpc.json
}

resource "aws_iam_role_policy" "external" {
  count  = length(var.external_iam_policies)
  name   = "${local.lambda_function_external_policy}-${count.index}"
  role   = aws_iam_role.this.id
  policy = element(var.external_iam_policies, count.index)
}
