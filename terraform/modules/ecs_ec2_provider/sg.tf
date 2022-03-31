module "sg" {
  source                     = "../sg"
  name_prefix                = local.ecs_ec2_sg_name
  vpc_id                     = local.vpc_id
  security_group_description = var.ecs_ec2_sg_description
  ingress_self_rules = [
    {
      from_port = 0
      to_port   = 0
      protocol  = "-1"
    }
  ]
  egress_cidr_rules = [
    {
      protocol  = "-1"
      from_port = 0
      to_port   = 0
      entries   = ["0.0.0.0/0"]
    }
  ]
}
