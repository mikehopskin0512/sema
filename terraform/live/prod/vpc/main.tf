module "prod_vpc" {
  source     = "../../../modules/vpc"
  cidr_block = "10.2.0.0/16"
  env        = "prod"
  az_count   = 3
}
