locals {
  sqs_queues = ["import-repository", "import-pull-request", "github-webhook"]
}

resource "aws_sqs_queue" "this" {
  for_each                  = toset(local.sqs_queues)
  name                      = "apollo-${var.name_prefix}-${each.key}"
  delay_seconds             = 30
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
}

resource "aws_sqs_queue_policy" "this" {
  for_each = toset(local.sqs_queues)

  queue_url = aws_sqs_queue.this[each.key].id

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
        "Resource" : "${aws_sqs_queue.this[each.key].id}"
      }
    ]
  })

  depends_on = [
    aws_sqs_queue.this
  ]
}
