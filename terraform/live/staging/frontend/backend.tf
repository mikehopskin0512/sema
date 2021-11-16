terraform {
  backend "s3" {
    bucket  = "sema-terraform"
    key     = "phoenix/stage/frontend/terraform.tfstate"
    region  = "us-east-1"
    profile = "sema-terraform"
  }
}
