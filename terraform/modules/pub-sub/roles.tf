# ---------------------------------------------------------------------------------------------------------------------
# SQS POLICY
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_sqs_queue_policy" "main_queue_policy" {
  queue_url = aws_sqs_queue.main.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "sqspolicy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.main.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${var.sns_topic}"
        }
      }
    }
  ]
}
POLICY
}
