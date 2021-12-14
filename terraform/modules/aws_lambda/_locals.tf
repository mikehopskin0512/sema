locals {
  lambda_function                   = "${var.name_prefix}-lambda"
  lambda_function_role              = "${local.lambda_function}-role"
  lambda_function_cloudwatch_policy = "${local.lambda_function}-cloudwatch-policy"
  lambda_function_vpc_policy        = "${local.lambda_function}-vpc-policy"
  lambda_function_external_policy   = "${local.lambda_function}-external-policy"
  sg                                = "${local.lambda_function}-sg"
}

locals {
  lambda_function_src_folder = dirname(var.lambda_function_src)
  lambda_function_zip        = "${local.lambda_function_src_folder}/lambda_function.zip"
}

locals {
  cloudwatch_log_group      = "/aws/lambda/${local.lambda_function}"
  cloudwatch_logs_encrypted = var.cloudwatch_kms_key != null ? true : false
  environment_map           = var.environment_variables == null ? [] : [var.environment_variables]
}

locals {
  tags = merge(
    {
      "Name" = local.lambda_function
    },
    var.tags
  )
  cloudwatch_log_group_tags = merge(
    {
      "Name" = local.cloudwatch_log_group
    },
    var.cloudwatch_tags
  )
  sg_tags = merge(
    {
      "Name" = local.sg
    },
    var.sg_tags
  )
}
