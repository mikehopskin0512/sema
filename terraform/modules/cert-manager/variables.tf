variable "domain" {
  description = "Domain name to create the cert for...i.e. example.com"
  type = string
}

variable "enable_route53" {
  description = "If true, enable route 53 for DNS validation of certificate"
  type = bool
}
