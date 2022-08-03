module "this" {
  source = "../aws_lambda"


  name_prefix        = var.name_prefix
  vpc_id             = var.vpc_id
  subnet_ids         = var.subnet_ids
  description        = "notify slack channel on sns topic"
  runtime            = "python3.9"
  memory_size        = 128
  timeout            = 30
  publish            = var.publish
  cloudwatch_kms_key = var.cloudwatch_kms_key

  lambda_function_src = "${path.module}/function/lambda_function.py"
  lambda_handler      = "lambda_function.lambda_handler"
  environment_variables = {
    "SLACK_URL"     = "${var.slack_url}"
    "SLACK_CHANNEL" = "${var.slack_channel}"
    "SLACK_USER"    = "${var.slack_user}"
  }
  external_iam_policies = []
}
