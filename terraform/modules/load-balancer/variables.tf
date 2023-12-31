
variable "cert_domain" {
  description = "The domain for the ssl cert that is being attached to the load balancer"
  type        = string
}

variable "env" {
  type = string
}

variable "name" {
  description = "The name used to identify the load balancer in AWS console"
  type        = string
}

variable "vpc_name" {
  description = "The name the vpc that the load balancer is being associated with"
}

variable "internal" {
  type        = bool
  description = "If true, the LB will be internal."
  default     = false
}
