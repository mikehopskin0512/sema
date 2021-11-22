resource "aws_ecs_cluster" "main" {
  name = "qa-frontend"
}

module "alb" {
  source = "../../../modules/load-balancer"

  cert_domain = "semasoftware.com"
  env         = "qa"
  name        = "qa-frontend"
  vpc_name    = "vpc-qa"
  internal    = true
}

module "web" {
  source = "../../../modules/frontend-ecs-service"

  aws_region        = "us-east-1"
  cluster_name      = aws_ecs_cluster.main.name
  cpu               = "1024"
  env               = "qa"
  domain            = "app-qa.semasoftware.com"
  health_check_path = "/login"
  image             = var.phoenix_image
  lb_listener_arn   = module.alb.https_listener
  lb_security_group = module.alb.alb_security_group
  memory            = "2048"
  port              = "3000"
  service_name      = "phoenix"
  task_count        = 1
  vpc_name          = "vpc-qa"
}

module "api" {
  source = "../../../modules/frontend-ecs-service"

  aws_region        = "us-east-1"
  cluster_name      = aws_ecs_cluster.main.name
  cpu               = "1024"
  env               = "qa"
  domain            = "api-qa.semasoftware.com"
  health_check_path = "/health"
  image             = var.apollo_image
  lb_listener_arn   = module.alb.https_listener
  lb_security_group = module.alb.alb_security_group
  memory            = "2048"
  port              = "3001"
  service_name      = "apollo"
  task_count        = 1
  vpc_name          = "vpc-qa"
}


