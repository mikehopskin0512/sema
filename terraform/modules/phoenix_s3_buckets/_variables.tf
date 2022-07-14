variable "name_prefix" {
  type        = string
  description = "Name prefix for all resources."
  validation {
    condition     = length(compact([null, "", var.name_prefix])) > 0
    error_message = "Name prefix must not be empty."
  }
}

variable "publisher_arns" {
  type        = list(string)
  description = "This is a list of arns for policy"
}

variable "bucket_name" {
  type        = string
  description = "Name of the bucket"
}
