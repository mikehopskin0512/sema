variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  validation {
    condition     = length(compact([null, "", var.name_prefix])) > 0
    error_message = "Name prefix must not be empty."
  }
}

variable "vpc_id" {
  type        = string
  description = "VPC ID to attach to."
  validation {
    condition     = length(compact([null, "", var.vpc_id])) > 0
    error_message = "VPC ID must not be empty."
  }
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs where Lambda will be hosted."
  validation {
    condition     = length(var.subnet_ids) > 0
    error_message = "List of subnet IDs must not be empty."
  }
}

variable "lambda_function_src" {
  type        = string
  description = "Lambda function src file path."
  validation {
    condition     = length(compact([null, "", var.lambda_function_src])) > 0
    error_message = "Lambda function src file path must not be empty."
  }
}
