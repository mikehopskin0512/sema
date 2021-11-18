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

# module "web" {
#   source = "../../../modules/frontend-ecs-service"

#   aws_region        = "us-east-1"
#   cluster_name      = aws_ecs_cluster.main.name
#   cpu               = "1024"
#   env               = "prod"
#   domain            = "app.semasoftware.com"
#   health_check_path = "/login"
#   image             = var.phoenix_image
#   lb_listener_arn   = module.alb.https_listener
#   lb_security_group = module.alb.alb_security_group
#   memory            = "2048"
#   port              = "3000"
#   service_name      = "phoenix"
#   task_count        = 3
#   vpc_name          = "vpc-prod"
# }

# module "api" {
#   source = "../../../modules/frontend-ecs-service"

#   aws_region        = "us-east-1"
#   cluster_name      = aws_ecs_cluster.main.name
#   cpu               = "1024"
#   env               = "prod"
#   domain            = "api.semasoftware.com"
#   health_check_path = "/health"
#   image             = var.apollo_image
#   lb_listener_arn   = module.alb.https_listener
#   lb_security_group = module.alb.alb_security_group
#   memory            = "2048"
#   port              = "3001"
#   service_name      = "apollo"
#   task_count        = 3
#   vpc_name          = "vpc-prod"
# }

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
  task_definition_resources = var.ecs_task_definition_resources
  ecr_repo = {
    arn     = data.terraform_remote_state.repos.outputs.phoenix_web_repo_arn
    kms_key = ""
  }

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
    port              = "3000"
    domain            = "semasoftware.com"
    domain_prefix     = "app-qa"
    dns_zone_id       = "Z1758VYBWE4JHY"
  }
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
  task_definition_resources = var.ecs_task_definition_resources
  ecr_repo = {
    arn     = data.terraform_remote_state.repos.outputs.apollo_web_repo_arn
    kms_key = ""
  }

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
    port              = "3001"
    domain            = "semasoftware.com"
    domain_prefix     = "api-qa"
    dns_zone_id       = "Z1758VYBWE4JHY"
  }
}
