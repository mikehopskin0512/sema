##########
# Common #
##########

variable "description" {
  type        = string
  description = "The lambda function description."
  default     = null
  validation {
    condition     = var.description != ""
    error_message = "Description variable must not be an empty string."
  }
}

variable "runtime" {
  type        = string
  description = "The runtime used in the lambda function."
  default     = "python3.8"
  validation {
    condition     = can(index(["nodejs10.x", "nodejs12.x", "java8", "python3.9", "java8.al2", "java11", "python2.7", "python3.6", "python3.7", "python3.8", "dotnetcore2.1", "dotnetcore3.1", "go1.x", "ruby2.5", "ruby2.7", "provided", "provided.al2"], var.runtime))
    error_message = "Only ['nodejs10.x', 'nodejs12.x', 'java8', 'java8.al2', 'java11', 'python2.7', 'python3.6', 'python3.7', 'python3.8', 'dotnetcore2.1', 'dotnetcore3.1', 'go1.x', 'ruby2.5', 'ruby2.7', 'provided', 'provided.al2'] values are allowed for runtime variable."
  }
}

variable "memory_size" {
  type        = number
  description = "Amount of memory in MB your Lambda Function can use at runtime."
  default     = 128
}

variable "timeout" {
  type        = number
  description = "The amount of time your Lambda Function has to run in seconds."
  default     = 3
}

variable "publish" {
  type        = bool
  description = "Should a new lambda version be created?"
  default     = false
}

variable "lambda_handler" {
  type        = string
  description = "Lambda handler function path."
  default     = "lambda_function.lambda_handler"
  validation {
    condition     = length(compact([null, "", var.lambda_handler])) > 0
    error_message = "Lambda handler function path must not be empty."
  }
}

variable "environment_variables" {
  type        = map(string)
  description = "A map that defines environment variables for the Lambda function."
  default     = null
}

variable "external_iam_policies" {
  type        = list(string)
  description = "A list of external iam policies attached to Lambda function."
  default     = []
}

variable "package_s3_acl" {
  type        = string
  description = "The canned ACL to apply"
  default     = "private"
}

variable "packages_s3_key" {
  type        = string
  description = "S3 key of an object containing the function's deployment package."
  default     = "lambda_layer_payload.zip"
}

variable "layer_enabled" {
  type        = bool
  description = "is layer enabled?"
  default     = false
}
###################
# CloudWatch Logs #
###################

variable "cloudwatch_kms_key" {
  type        = string
  description = "CloudWatch log group kms key id."
  default     = null
  validation {
    condition     = var.cloudwatch_kms_key != ""
    error_message = "CloudWatch kms key variable must not be an empty string."
  }
}

###########
# Tagging #
###########

variable "tags" {
  type        = map(string)
  description = "A key - value list of tags, that is attached to the distribution."
  default     = {}
}

variable "sg_tags" {
  type        = map(string)
  description = "A key - value list of additional tags, that is attached to EC2 sg."
  default     = {}
}

variable "cloudwatch_tags" {
  type        = map(string)
  description = "A key - value list of tags, that is attached to the CloudWatch log group."
  default     = {}
}
