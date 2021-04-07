module "qa1_vpc" {
  source     = "../../../modules/vpc"
  cidr_block = "10.2.0.0/16"
  env        = "qa1"
  az_count   = 3
}
