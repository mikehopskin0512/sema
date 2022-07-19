module "this" {
  source             = "../aws_lambda"
  name_prefix        = var.name_prefix
  vpc_id             = var.vpc_id
  subnet_ids         = var.subnet_ids
  description        = var.description
  runtime            = var.runtime
  memory_size        = var.memory_size
  timeout            = var.timeout
  publish            = var.publish
  cloudwatch_kms_key = var.cloudwatch_kms_key
  layer_enabled      = true

  lambda_function_src   = "${path.module}/function/lambda_function.py"
  lambda_handler        = "lambda_function.lambda_handler"
  environment_variables = {}
  external_iam_policies = []
}
