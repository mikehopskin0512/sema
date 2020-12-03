# ---------------------------------------------------------------------------------------------------------------------
# SQS QUEUE
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_sqs_queue" "main" {
  name = "${var.env}-${var.sqs_name}"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.main_dl_queue.arn
    maxReceiveCount     = 5
  })

  message_retention_seconds  = 86400
  receive_wait_time_seconds  = 20
  visibility_timeout_seconds = 30

  kms_master_key_id                 = var.kms_alias
  kms_data_key_reuse_period_seconds = 300

  tags = {
    Name      = "${var.env}-${var.sqs_name}"
    Env       = var.env
    Terraform = true
  }
}

resource "aws_sqs_queue" "main_dl_queue" {
  name                              = "${var.env}-${var.sqs_name}-dl-queue"
  kms_master_key_id                 = var.kms_alias
  kms_data_key_reuse_period_seconds = 300

  tags = {
    Name      = "${var.env}-${var.sqs_name}-dl-queue"
    Env       = var.env
    Terraform = true
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# SNS SUBSCRIPTION
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_sns_topic_subscription" "main" {
  topic_arn     = var.sns_topic
  protocol      = "sqs"
  endpoint      = aws_sqs_queue.main.arn
  filter_policy = var.sns_filter_policy
}

# ---------------------------------------------------------------------------------------------------------------------
# LAMBDA EVENT SOURCE
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_lambda_event_source_mapping" "lambda_event_source" {
  event_source_arn = aws_sqs_queue.main.arn
  enabled          = true
  function_name    = var.lambda_arn
  batch_size       = 10
}
