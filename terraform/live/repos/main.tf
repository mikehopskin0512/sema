
resource "aws_ecr_repository" "apollo" {
  name = "apollo"
}

resource "aws_ecr_repository" "phoenix" {
  name = "phoenix"
}

resource "aws_ecr_repository" "athena_eric" {
  name = "athena-eric"
}
