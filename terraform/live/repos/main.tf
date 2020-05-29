
resource "aws_ecr_repository" "phoenix-web" {
  name = "phoenix-web"
}

resource "aws_ecr_repository" "phoenix-apollo" {
  name = "phoenix-apollo"
}
