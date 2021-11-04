resource "aws_ecs_cluster" "main" {
  name = "stage-frontend"
}

module "alb" {
  source = "../../../modules/load-balancer"

  cert_domain = "semasoftware.com"
  env         = "stage"
  name        = "stage-frontend"
  vpc_name    = "vpc-stage"
}

module "web" {
  source = "../../../modules/frontend-ecs-service"

  aws_region        = "us-east-1"
  cluster_name      = aws_ecs_cluster.main.name
  cpu               = "1024"
  env               = "stage"
  domain            = "stage-app.semasoftware.com"
  health_check_path = "/login"
  image             = var.phoenix_image
  lb_listener_arn   = module.alb.https_listener
  lb_security_group = module.alb.alb_security_group
  memory            = "2048"
  port              = "3000"
  service_name      = "phoenix"
  task_count        = 3
  vpc_name          = "vpc-stage"
}

module "ecs_task" {
  source = "./modules/ecs_task"

  name_prefix               = var.name_prefix
  vpc_id                    = var.vpc_id
  subnets                   = var.vpc_subnets.private
  application               = var.application
  ecs_cluster               = var.ecs_cluster
  task_count                = var.ecs_task_count
  task_definition_resources = var.ecs_task_definition_resources
  ecr_repo = {
    arn     = aws_ecr_repository.this.arn
    url     = aws_ecr_repository.this.repository_url
    kms_key = aws_ecr_repository.this.encryption_configuration[0].kms_key
  }
  ecr_image             = var.ecs_ecr_image
  external_iam_policies = [data.aws_iam_policy_document.s3.json]
  ecs_secrets           = local.ecs_secrets
  ecs_envs = [
    {
      name  = "AWS_SECRETS_HASH"
      value = local.ecs_secrets_hash
    }
  ]
  ecs_external_access = {
    target_group_arn = module.alb.tg
    port             = var.port
    allowed_sg       = [module.alb.sg]
  }
}

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


