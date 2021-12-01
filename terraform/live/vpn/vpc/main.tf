module "qa_vpc" {
  source     = "../../../modules/vpc"
  cidr_block = "10.1.0.0/16"
  env        = "qa"
  az_count   = 3
}
