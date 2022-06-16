
resource "aws_ecr_repository" "apollo" {
  name = "apollo"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "apollo_worker" {
  name = "apollo-worker"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "phoenix" {
  name = "phoenix"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "hephaestus" {
  name = "hephaestus"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "athena_ananke" {
  name = "athena-ananke"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "athena_eric" {
  name = "athena-eric"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "athena_janus" {
  name = "athena-janus"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "athena_momus" {
  name = "athena-momus"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "athena_plutus" {
  name = "athena-plutus"

  image_scanning_configuration {
    scan_on_push = true
  }
}
