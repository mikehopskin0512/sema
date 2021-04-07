
resource "aws_ecr_repository" "apollo" {
  name = "apollo"
}

resource "aws_ecr_repository" "phoenix" {
  name = "phoenix"
}

resource "aws_ecr_repository" "athena_ananke" {
  name = "athena-ananke"
}

resource "aws_ecr_repository" "athena_eric" {
  name = "athena-eric"
}

resource "aws_ecr_repository" "athena_janus" {
  name = "athena-janus"
}

resource "aws_ecr_repository" "athena_momus" {
  name = "athena-momus"
}

resource "aws_ecr_repository" "athena_plutus" {
  name = "athena-plutus"
}