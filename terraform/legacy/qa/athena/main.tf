module "athena" {
  source = "../../../modules/state-machine"

  batch_ssh_key         = "phoenix_qa"
  efs_access_point_name = "customer-repos"
  efs_host_path         = "/mnt/efs"
  env                   = "qa"
  eric_image            = "091235034633.dkr.ecr.us-east-1.amazonaws.com/athena-eric:latest"
  pipeline_name         = "athena"
  vpc_name              = "vpc-qa"
}

module "athena_kms" {
  source = "../../../modules/kms"

  description = "KMS key for Athena message broker"
  env         = "qa"
  alias       = "analysis-key"
}

resource "aws_sns_topic" "code_analysis" {
  name              = "qa-code-analysis-topic"
  kms_master_key_id = module.athena_kms.key_alias

  tags = {
    Name      = "qa-code-analysis-topic"
    Env       = "qa"
    Terraform = true
  }
}

module "athena_message_broker" {
  source = "../../../modules/pub-sub"

  env        = "qa"
  kms_alias  = module.athena_kms.key_alias
  lambda_arn = module.athena_analysis.lambda_arn
  sns_topic  = aws_sns_topic.code_analysis.arn
  sns_filter_policy = jsonencode({
    analysis = ["athena"]
  })
  sqs_name = "code-analysis"
}

module "scqp_message_broker" {
  source = "../../../modules/pub-sub"

  env        = "qa"
  kms_alias  = module.athena_kms.key_alias
  lambda_arn = module.scqp_analysis.lambda_arn
  sns_topic  = aws_sns_topic.code_analysis.arn
  sns_filter_policy = jsonencode({
    analysis = ["scqp"]
  })
  sqs_name = "scqp"
}

module "athena_analysis" {
  source = "../../../modules/lambda"

  env                  = "qa"
  vpc_name             = "vpc-qa"
  step_function_arn    = module.athena.state_machine_arn
  function_description = "Initiates a code analysis in Athena"
  function_memory      = 128
  function_name        = "athena-proxy"
  function_source_dir  = "lambda-proxy"
  function_timeout     = 5
  function_variables = {
    STATEMACHINE_ARN = module.athena.state_machine_arn 
    REGION           = "us-east-1"
    ENDPOINT         = "https://states.us-east-1.amazonaws.com" 
  }
}

module "scqp_analysis" {
  source = "../../../modules/lambda"

  env                  = "qa"
  vpc_name             = "vpc-qa"
  step_function_arn    = module.scqp.state_machine_arn
  function_description = "Initiates a code analysis in Scqp"
  function_memory      = 128
  function_name        = "scqp-proxy"
  function_source_dir  = "lambda-proxy"
  function_timeout     = 5
  function_variables = {
    STATEMACHINE_ARN = module.scqp.state_machine_arn
    REGION           = "us-east-2"
    ENDPOINT         = "https://states.us-east-2.amazonaws.com" 
  }
}

module "scqp" {
  source = "../../../modules/scqp-state-machine"

  providers = {
    aws = aws.ohio
  }
  env                   = "dev-bonsai"
  cluster_arn            = "arn:aws:ecs:us-east-2:091235034633:cluster/dev-bonsai"
  pipeline_name         = "scqp"
}