terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
    template = {
      source  = "hashicorp/template"
      version = "2.2.0"
    }

  }
}

provider "aws" {
  region  = var.aws_region
  profile = "sema-terraform"
}
