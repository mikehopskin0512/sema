data "aws_kms_alias" "athena" {
  name = "alias/qa-analysis-key"
}

resource "aws_sns_topic" "data_pipeline" {
  name              = "qa-cross-region-replication"
  kms_master_key_id = data.aws_kms_alias.athena.arn

  tags = {
    Name      = "qa-cross-region-replication"
    Env       = "qa"
    Terraform = true
  }
}

module "org_data_pipeline" {
  source = "../../../modules/pub-sub"

  env        = "qa"
  kms_alias  = data.aws_kms_alias.athena.arn
  lambda_arn = module.org_replicator.lambda_arn
  sns_topic  = aws_sns_topic.data_pipeline.arn
  sns_filter_policy = jsonencode({
    action = ["createOrg"]
  })
  sqs_name = "org-replication-requests"
}

module "repo_data_pipeline" {
  source = "../../../modules/pub-sub"

  env        = "qa"
  kms_alias  = data.aws_kms_alias.athena.arn
  lambda_arn = module.repo_replicator.lambda_arn
  sns_topic  = aws_sns_topic.data_pipeline.arn
  sns_filter_policy = jsonencode({
    action = ["createRepo"]
  })
  sqs_name = "repo-replication-requests"
}

module "org_replicator" {
  source = "../../../modules/lambda"

  env                  = "qa"
  vpc_name             = "vpc-qa"
  layers               = [module.data_pipeline_layers.layer_arn]
  function_description = "Adds orgs created in Phoenix to SCQP so that ingestions can run"
  function_memory      = 128
  function_name        = "org-replicator"
  function_timeout     = 5
  function_variables = {
    MONGO_PATH          = "/qa/apollo/mongo/uri"
    POSTGRES_CONNECTION = "/qa/apollo/postgres/uri"
  }
}

module "repo_replicator" {
  source = "../../../modules/lambda"

  env                  = "qa"
  vpc_name             = "vpc-qa"
  layers               = [module.data_pipeline_layers.layer_arn]
  function_description = "Adds repos created in Phoenix to SCQP so that ingestions can run"
  function_memory      = 256
  function_name        = "repo-replicator"
  function_timeout     = 5
  function_variables = {
    MONGO_PATH          = "/qa/apollo/mongo/uri"
    POSTGRES_CONNECTION = "/qa/apollo/postgres/uri"
  }
}

module "data_pipeline_layers" {
  source = "../../../modules/lambda-layer"

  env                  = "qa"
  layer_name           = "replication"
}
