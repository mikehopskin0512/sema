provider "aws" {
  alias   = "peer"
  profile = var.aws_profile
  region  = local.peer_region
}

provider "aws" {
  alias   = "main"
  profile = var.aws_profile
  region  = local.main_region
}
