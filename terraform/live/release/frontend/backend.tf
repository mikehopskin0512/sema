terraform {
  backend "s3" {
    bucket  = "sema-terraform"
    key     = "phoenix/release/frontend/terraform.tfstate"
    region  = "us-east-1"
    profile = "sema-terraform"
  }
}
