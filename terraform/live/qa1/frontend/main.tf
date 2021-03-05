resource "aws_ecs_cluster" "main" {
  name = "qa1-frontend"
}

module "alb" {
  source = "../../../modules/load-balancer"

  cert_domain = "semasoftware.com"
  env         = "qa1"
  name        = "qa1-frontend"
  vpc_name    = "vpc-qa1"
}

module "web" {
  source = "../../../modules/frontend-ecs-service"

  aws_region        = "us-east-1"
  cluster_name      = aws_ecs_cluster.main.name
  cpu               = "1024"
  env               = "qa1"
  domain            = "app-qa1.semasoftware.com"
  health_check_path = "/login"
  image             = "091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:qa1"
  lb_listener_arn   = module.alb.https_listener
  lb_security_group = module.alb.alb_security_group
  memory            = "2048"
  port              = "3000"
  service_name      = "phoenix"
  task_count        = 1
  vpc_name          = "vpc-qa1"
}

module "api" {
  source = "../../../modules/frontend-ecs-service"

  aws_region        = "us-east-1"
  cluster_name      = aws_ecs_cluster.main.name
  cpu               = "1024"
  env               = "qa1"
  domain            = "api-qa1.semasoftware.com"
  health_check_path = "/health"
  image             = "091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:qa1"
  lb_listener_arn   = module.alb.https_listener
  lb_security_group = module.alb.alb_security_group
  memory            = "2048"
  port              = "3001"
  service_name      = "apollo"
  task_count        = 1
  vpc_name          = "vpc-qa1"
}


