provider "aws" {
  version = "~> 3.0"
  region  = var.aws_region
  profile = "sema-terraform"
}

provider "aws" {
  alias   = "ohio"
  version = "~> 3.0"
  region  = "us-east-2"
  profile = "sema-terraform"
}