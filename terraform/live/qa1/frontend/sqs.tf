locals {
  sqs_queues        = ["import-repository", "github-webhook", "poll-repository", "poll-repositories", "analyze-comments"]
  sqs_queues_alarms = ["poll-repository"]
  sqs_queues_arn    = [for queue in aws_sqs_queue.this : queue.arn]
}

resource "aws_sqs_queue" "this" {
  for_each                  = toset(local.sqs_queues)
  name                      = "apollo-${var.name_prefix}-${each.key}"
  delay_seconds             = 0
  max_message_size          = 262144
  message_retention_seconds = 604800
  receive_wait_time_seconds = 20
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
            "${module.apollo_worker.role_arn}",
            "${module.apollo.role_arn}"
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
