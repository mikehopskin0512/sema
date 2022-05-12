resource "aws_sqs_queue" "import_repository" {
  name                      = "apollo-qa1-import-repository"
  delay_seconds             = 30
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

}

resource "aws_sqs_queue" "import_pull_request" {
  name                      = "apollo-qa1-import-pull-request"
  delay_seconds             = 30
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

}

resource "aws_sqs_queue" "github_webhook" {
  name                      = "apollo-qa1-github-webhook"
  delay_seconds             = 30
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

}

resource "aws_sqs_queue_policy" "import_repository" {
  queue_url = aws_sqs_queue.import_repository.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "AWS" : [
            "${module.apollo_worker.role_arn}"
          ]
        },
        "Action" : [
          "sqs:ChangeMessageVisibility",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:GetQueueUrl",
          "sqs:ListQueues",
          "sqs:ReceiveMessage",
          "sqs:SendMessage"
        ],
        "Resource" : "${aws_sqs_queue.import_repository.arn}"
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "import_pull_request" {
  queue_url = aws_sqs_queue.import_pull_request.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "AWS" : [
            "${module.apollo_worker.role_arn}"
          ]
        },
        "Action" : [
          "sqs:ChangeMessageVisibility",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:GetQueueUrl",
          "sqs:ListQueues",
          "sqs:ReceiveMessage",
          "sqs:SendMessage"
        ],
        "Resource" : "${aws_sqs_queue.import_pull_request.arn}"
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "github_webhook" {
  queue_url = aws_sqs_queue.github_webhook.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "AWS" : [
            "${module.apollo_worker.role_arn}"
          ]
        },
        "Action" : [
          "sqs:ChangeMessageVisibility",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:GetQueueUrl",
          "sqs:ListQueues",
          "sqs:ReceiveMessage",
          "sqs:SendMessage"
        ]
        "Resource" : "${aws_sqs_queue.github_webhook.arn}"
      }
    ]
  })
}
