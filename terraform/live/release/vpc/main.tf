resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = var.vpc_enable_dns_support
  enable_dns_hostnames = var.vpc_enable_dns_hostnames
  tags                 = local.vpc_tags
}

module "vpc_subnet_public" {
  source      = "../../../modules/vpc_subnet"
  name_prefix = var.name_prefix
  vpc_id      = aws_vpc.this.id
  cidr_suffix = var.vpc_subnet_public_suffix
}

module "vpc_subnet_private" {
  source      = "../../../modules/vpc_subnet"
  name_prefix = var.name_prefix
  vpc_id      = aws_vpc.this.id
  nat_subnets = [module.vpc_subnet_public.id[1]]
  cidr_suffix = var.vpc_subnet_private_suffix
}

module "vpn_peering" {
  source = "../../../modules/vpc_peering"

  name_prefix = local.vpn_peering_prefix
  aws_profile = var.aws_profile

  vpc_id           = aws_vpc.this.id
  vpc_route_tables = concat(module.vpc_subnet_public.rt_id, module.vpc_subnet_private.rt_id)

  peer_region = "us-east-2"             // vpn vpc region 
  peer_vpc_id = "vpc-03eb634f0651b5fb8" // vpn vpc id

}

module "scqp_peering" {
  source = "../../../modules/vpc_peering"

  name_prefix = local.scqp_peering_prefix
  aws_profile = var.aws_profile

  vpc_id           = aws_vpc.this.id
  vpc_route_tables = concat(module.vpc_subnet_public.rt_id, module.vpc_subnet_private.rt_id)

  peer_region = "us-east-2"    // scqp vpc region
  peer_vpc_id = "vpc-d75be4bf" // scqp vpc id

}

module "vpc_peering" {
  source = "../../../modules/vpc_peering"

  name_prefix = local.scqp_peering_prefix
  aws_profile = var.aws_profile

  vpc_id           = aws_vpc.this.id
  vpc_route_tables = concat(module.vpc_subnet_public.rt_id, module.vpc_subnet_private.rt_id)

  peer_vpc_id = "vpc-0b06a5cf6ae74ca1d" // vpn vpc id

}
