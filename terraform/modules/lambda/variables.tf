variable "env" {}

variable "function_description" {
  description = "A short description of the purpose of the function"
}

variable "function_memory" {
  description = "The amount of memory to assign to the function"
}

variable "function_name" {
  description = "The name we are giving the lambda"
}

variable "function_source_dir" {
  default = "default_null"
  description = "Name of lambda function to use as the source.  Defaults to function_name value if this is not specified"
}

variable "function_timeout" {
  description = "The number of seconds before the function times out"
}

variable "function_variables" {
  description = "ENV vars to pass to the function"
}

variable "layers" {
  default = []
}

variable "step_function_arn" {
  default = "default_null"
}

variable "vpc_name" {
  description = "The name the vpc in which the lambda is being created"
}