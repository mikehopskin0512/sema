terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/aws"
      version = "~> 3.38.0"
    }
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "sema-terraform"
}
