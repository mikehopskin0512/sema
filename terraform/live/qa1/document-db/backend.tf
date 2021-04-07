terraform {
  backend "s3" {
    bucket  = "sema-terraform"
    key     = "phoenix/qa1/document-db/terraform.tfstate"
    region  = "us-east-1"
    profile = "sema-terraform"
  }
}
