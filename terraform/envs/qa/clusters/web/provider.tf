provider "aws" {
  version = "~> 2.1"
  region  = var.aws_region
  profile = "sema-terraform"
}
