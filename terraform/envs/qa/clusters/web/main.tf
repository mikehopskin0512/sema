
module "qa_web_cluster" {
  source = "../../../../modules/ecs-cluster"

  cluster_name = "phoenix-web"
  vpc_name = "vpc-qa"
  aws_region = "us-east-1"
  app_image = "091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix-web:latest"
  app_port = "3000"
  fargate_cpu = "1024"
  fargate_memory = "2048"
  env = "qa"
  az_count = 3
}

# ---------------------------------------------------------------------------------------------------------------------
# ADD VPN CIDR ACCESS TO THE LOAD BALANCER SECURITY GROUP (FOR VPC PEERING)
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_security_group_rule" "vpn" {
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["10.0.0.90/32"]
  security_group_id = module.qa_web_cluster.alb_security_group
}
