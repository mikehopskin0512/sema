module "vpn_vpc" {
  source     = "../../../modules/vpc"
  cidr_block = "10.1.0.0/16"
  env        = "vpn"
  az_count   = 3
}
