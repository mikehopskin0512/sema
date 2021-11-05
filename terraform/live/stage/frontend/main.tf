resource "aws_ecs_cluster" "main" {
  name = "stage-frontend"
}

module "alb" {
  source = "../../../modules/load-balancer"

  cert_domain = "semasoftware.com"
  env         = var.name_prefix
  name        = local.alb
  vpc_name    = var.vpc_name
}

module "phoenix" {
  source = "../../../modules/ecs_task"

  name_prefix = var.name_prefix
  vpc_id      = data.aws_vpc.this.id
  subnets     = data.aws_subnet_ids.private.ids
  application = "phoenix"
  ecs_cluster = {
    arn = aws_ecs_cluster.main.id
    name = aws_ecs_cluster.main.name
  } 
  task_definition_resources = var.ecs_task_definition_resources
  ecr_repo = {
    arn     = data.terraform_remote_state.repos.outputs.phoenix_web_repo_arn
    url     = data.terraform_remote_state.repos.outputs.phoenix_web_repo_url
    kms_key = ""
  }

  image             = var.phoenix_image
  health_check_path = "/login"
  ecs_secrets       = local.ecs_secrets
  ecs_envs = [
    {
      name  = "AWS_SECRETS_HASH"
      value = local.ecs_secret_data_hash
    }
  ]
  ecs_external_access = {
    lb_zone_id        = module.alb.alb_zone_id
    lb_domain         = module.alb.alb_domain
    lb_listener_arn   = module.alb.https_listener
    lb_security_group = module.alb.alb_security_group
    port              = "3000"
    domain            = "semasoftware.com"
    domain_prefix     = "app-stage"
    dns_zone_id       = "Z1758VYBWE4JHY"
  }
}

resource "aws_secretsmanager_secret" "phoenix" {
  name = local.phoenix_secret
}

resource "aws_secretsmanager_secret_version" "phoenix" {
  secret_id     = aws_secretsmanager_secret.phoenix.id
  secret_string = jsonencode({})
}


