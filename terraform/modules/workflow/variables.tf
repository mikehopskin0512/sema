variable "batch_job_definition" {
  description = "Batch job that step function will run"
}

variable "batch_job_queue" {
  description = "Queue for batch jobs"
}

variable "env" {}

variable "role_arn" {
  description = "IAM role assigned to the step function"
}

variable "workflow_name" {
  description = "The name we are giving the AWS Step function (state machine)"
}