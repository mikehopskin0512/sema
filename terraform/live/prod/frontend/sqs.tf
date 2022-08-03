locals {
  sqs_queues        = ["import-repository", "github-webhook", "poll-repository", "poll-repositories"]
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

resource "aws_cloudwatch_metric_alarm" "oldest" {
  for_each            = toset(local.sqs_queues_alarms)
  alarm_name          = "apollo-${var.name_prefix}-${each.key}-oldest-item"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "10"
  metric_name         = "ApproximateAgeOfOldestMessage"
  namespace           = "AWS/SQS"
  period              = "60"
  statistic           = "Maximum"
  threshold           = "600"
  alarm_description   = "This metric monitors the oldest item in the queue"
  alarm_actions       = can(aws_sns_topic.cw_topic[each.key].arn) ? [aws_sns_topic.cw_topic[each.key].arn] : []

  dimensions = {
    QueueName = "apollo-${var.name_prefix}-${each.key}"
  }
}

resource "aws_sns_topic" "cw_topic" {
  for_each = toset(local.sqs_queues_alarms)
  name     = "apollo-${var.name_prefix}-${each.key}-cw-topic"
  delivery_policy = jsonencode(
    {
      "http" : {
        "defaultHealthyRetryPolicy" : {
          "minDelayTarget" : 20,
          "maxDelayTarget" : 20,
          "numRetries" : 3,
          "numMaxDelayRetries" : 0,
          "numNoDelayRetries" : 0,
          "numMinDelayRetries" : 0,
          "backoffFunction" : "linear"
        },
        "disableSubscriptionOverrides" : false,
        "defaultThrottlePolicy" : {
          "maxReceivesPerSecond" : 1
        }
      }
    }
  )
}

module "slack_lambda" {
  source = "../../../modules/slack_lambda"

  name_prefix   = "${var.name_prefix}-slack-lambda"
  vpc_id        = data.aws_vpc.this.id
  subnet_ids    = data.aws_subnet_ids.private.ids
  slack_url     = "https://hooks.slack.com/services/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"
  slack_channel = "alerts"
  slack_user    = "lambda"
}

resource "aws_sns_topic_subscription" "slack_endpoint" {
  for_each               = toset(local.sqs_queues_alarms)
  endpoint               = module.slack_lambda.arn
  protocol               = "lambda"
  endpoint_auto_confirms = true
  topic_arn              = aws_sns_topic.cw_topic[each.key].arn
}

resource "aws_lambda_permission" "sns_lambda_slack_invoke" {
  for_each      = toset(local.sqs_queues_alarms)
  statement_id  = "sns_slackAllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = module.slack_lambda.arn
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.cw_topic[each.key].arn
}
