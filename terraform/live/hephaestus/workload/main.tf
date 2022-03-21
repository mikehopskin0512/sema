module "alb" {
  source = "../../../modules/load-balancer"

  cert_domain = "semasoftware.com"
  env         = "hephaestus"
  name        = "hephaestus"
  vpc_name    = "vpc-hephaestus"
}

resource "aws_ecs_cluster" "main" {
  name = "hephaestus-workload"
}

module "ecs_ec2_provider" {
  for_each = var.ec2_capacity_provider_enabled ? toset(["created"]) : toset([])
  source   = "../../../modules/ecs_ec2_provider"

  vpc_subnet_ids         = data.aws_subnet_ids.private.ids
  name_prefix            = var.name_prefix
  ecs_cluster_name       = aws_ecs_cluster.main.name // TODO get name from cluster resource
  instance_type          = "p2.xlarge"
  root_block_volume_size = 200
}

module "hephaestus" {
  source = "../../../modules/ecs_task"

  name_prefix = var.name_prefix
  vpc_id      = data.aws_vpc.this.id
  subnets     = data.aws_subnet_ids.private.ids
  application = "hephaestus"
  ecs_cluster = {
    arn  = aws_ecs_cluster.main.id
    name = aws_ecs_cluster.main.name
  }
  task_definition_resources = var.ecs_task_definition_resources
  ecr_repo = {
    arn     = data.terraform_remote_state.repos.outputs.hephaestus_web_repo_arn
    kms_key = ""
  }

  datadog_api_key   = local.datadog_hephaestus_api_key
  image             = var.hephaestus_image
  health_check_path = "/"
  ecs_secrets       = local.hephaestus_ecs_secrets
  ecs_envs = [
    {
      name  = "AWS_SECRETS_HASH"
      value = local.hephaestus_ecs_secret_data_hash
    }
  ]
  ecs_external_access = {
    lb_zone_id        = module.alb.alb_zone_id
    lb_domain         = module.alb.alb_domain
    lb_listener_arn   = module.alb.https_listener
    lb_security_group = module.alb.alb_security_group
    port              = "8000"
    domain            = "semasoftware.com"
    domain_prefix     = "hephaestus"
    dns_zone_id       = "Z1758VYBWE4JHY"
  }
  # ephemeral_storage                    = 50
  requires_compatibilities_ec2_enabled = true
  gpu                                  = "1"

  min_capacity = 1
  max_capacity = 3

  depends_on = [
    module.ecs_ec2_provider
  ]
}
