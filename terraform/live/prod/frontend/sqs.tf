resource "aws_sqs_queue" "import_repository" {
  name                      = "apollo-prod-import-repository"
  delay_seconds             = 30
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

}

resource "aws_sqs_queue" "import_pull_request" {
  name                      = "apollo-prod-import-pull-request"
  delay_seconds             = 30
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

}

resource "aws_sqs_queue" "github_webhook" {
  name                      = "apollo-prod-github-webhook"
  delay_seconds             = 30
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

}
