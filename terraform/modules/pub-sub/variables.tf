variable "env" {}

variable "kms_alias" {
  description = "Name of key used for server side encryption"
}

variable "lambda_arn" {
  description = "ARN of the lambda that will be triggered by sqs"
}

variable "sns_topic" {
  description = "SNS topic that SQS subscribes to"
}

variable "sns_filter_policy" {
  description = "Used in SNS subscription to filter messages seen by the target queue"
  default     = "{}"
}

variable "sqs_name" {
  description = "Name of SQS to create"
}
