terraform {
  backend "s3" {
    bucket  = "sema-terraform"
    key     = "phoenix/prod/document-db/terraform.tfstate"
    region  = "us-east-1"
    profile = "sema-terraform"
  }
}
