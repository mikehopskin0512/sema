resource "aws_ecs_cluster" "main" {
  name = "prod-frontend"
}

module "alb" {
  source = "../../../modules/load-balancer"

  cert_domain = "semasoftware.com"
  env         = "prod"
  name        = "prod-frontend"
  vpc_name    = "vpc-prod"
}

module "phoenix" {
  source = "../../../modules/ecs_task"

  name_prefix = var.name_prefix
  vpc_id      = data.aws_vpc.this.id
  subnets     = data.aws_subnet_ids.private.ids
  application = "phoenix"
  ecs_cluster = {
    arn  = aws_ecs_cluster.main.id
    name = aws_ecs_cluster.main.name
  }
  sg_description                   = "allow inbound access from the ALB only"
  task_definition_resources_cpu    = var.ecs_task_definition_resources_cpu
  task_definition_resources_memory = var.ecs_task_definition_resources_memory
  ecr_repo = {
    arn     = data.terraform_remote_state.repos.outputs.phoenix_web_repo_arn
    kms_key = ""
  }

  datadog_api_key   = local.datadog_phoenix_api_key
  image             = var.phoenix_image
  health_check_path = "/login"
  ecs_secrets       = local.phoenix_ecs_secrets
  ecs_envs = [
    {
      name  = "AWS_SECRETS_HASH"
      value = local.phoenix_ecs_secret_data_hash
    }
  ]
  ecs_external_access = {
    lb_zone_id        = module.alb.alb_zone_id
    lb_domain         = module.alb.alb_domain
    lb_listener_arn   = module.alb.https_listener
    lb_security_group = module.alb.alb_security_group
    domain            = "semasoftware.com"
    port              = "3000"
    domain_prefix     = "app"
    dns_zone_id       = "Z1758VYBWE4JHY"
  }

  min_capacity = 10
  max_capacity = 20
}

module "apollo" {
  source = "../../../modules/ecs_task"

  name_prefix = var.name_prefix
  vpc_id      = data.aws_vpc.this.id
  subnets     = data.aws_subnet_ids.private.ids
  application = "apollo"
  ecs_cluster = {
    arn  = aws_ecs_cluster.main.id
    name = aws_ecs_cluster.main.name
  }
  task_definition_resources_cpu    = var.ecs_task_definition_resources_cpu
  task_definition_resources_memory = var.ecs_task_definition_resources_memory
  ecr_repo = {
    arn     = data.terraform_remote_state.repos.outputs.apollo_web_repo_arn
    kms_key = ""
  }

  datadog_api_key   = local.datadog_apollo_api_key
  sg_description    = "allow inbound access from the ALB only"
  image             = var.apollo_image
  health_check_path = "/health"
  ecs_secrets       = local.apollo_ecs_secrets
  ecs_envs = [
    {
      name  = "AWS_SECRETS_HASH"
      value = local.apollo_ecs_secret_data_hash
    }
  ]
  ecs_external_access = {
    lb_zone_id        = module.alb.alb_zone_id
    lb_domain         = module.alb.alb_domain
    lb_listener_arn   = module.alb.https_listener
    lb_security_group = module.alb.alb_security_group
    domain            = "semasoftware.com"
    port              = "3001"
    domain_prefix     = "api"
    dns_zone_id       = "Z1758VYBWE4JHY"
  }

  external_iam_policies = [
    data.aws_iam_policy_document.this.json
  ]

  min_capacity = 10
  max_capacity = 20
}

module "apollo_worker" {
  source = "../../../modules/ecs_task"

  name_prefix = var.name_prefix
  vpc_id      = data.aws_vpc.this.id
  subnets     = data.aws_subnet_ids.private.ids
  application = "apollo-worker"
  ecs_cluster = {
    arn  = aws_ecs_cluster.main.id
    name = aws_ecs_cluster.main.name
  }
  task_definition_resources_cpu    = var.ecs_task_definition_resources_cpu
  task_definition_resources_memory = var.ecs_task_definition_resources_memory
  ecr_repo = {
    arn     = data.terraform_remote_state.repos.outputs.apollo_worker_web_repo_arn
    kms_key = ""
  }

  datadog_api_key = local.datadog_apollo_api_key
  image           = var.apollo_worker_image
  ecs_secrets     = local.apollo_ecs_secrets
  ecs_envs = [
    {
      name  = "AWS_SECRETS_HASH"
      value = local.apollo_ecs_secret_data_hash
    }
  ]

  external_iam_policies = [
    data.aws_iam_policy_document.this.json
  ]

  min_capacity = 10
  max_capacity = 20
}
