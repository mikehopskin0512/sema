terraform {
  backend "s3" {
    bucket  = "sema-terraform"
    key     = "phoenix/release/vpc/terraform.tfstate"
    region  = "us-east-1"
    profile = "sema-terraform"
  }
}
