# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# CREATE ALL THE RESOURCES FOR A WILDCARD ACM CERTIFICATE WITH ROUTE 53 DNS VALIDATION
# Note: If Route 53 is not being used for this domain, enable_route53 should be set to false
# and terraform will skip creating those resources.
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


# ---------------------------------------------------------------------------------------------------------------------
# CREATE THE WILDCARD CERT IN ACM FOR USE WITH AWS RESOURCES
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_acm_certificate" "cert" {
  domain_name = var.domain
  subject_alternative_names = ["*.${var.domain}"]
  validation_method = "DNS"

  tags = {
    Name = var.domain
    Terraform = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# GET THE HOSTED ZONE GIVEN THE DOMAIN NAME (SHOULD ALREADY EXIST)
# ---------------------------------------------------------------------------------------------------------------------

data "aws_route53_zone" "domain" {
  count                   =  var.enable_route53 ? 1 : 0
  name         = "${var.domain}"
  private_zone = false
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE A DNS RECORD TO VALIDATE THE CERTIFICATE REQUEST
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_route53_record" "cert_validation" {
  count   =  var.enable_route53 ? 1 : 0
  name    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.domain[count.index].id
  records = ["${aws_acm_certificate.cert.domain_validation_options.0.resource_record_value}"]
  ttl     = 60
}

# ---------------------------------------------------------------------------------------------------------------------
# MECHANISM TO WAIT FOR THE CERT REQUEST TO BE VALIDATED BEFORE ALLOWING IT TO BE USED BY TERRAFORM
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_acm_certificate_validation" "cert" {
  count                   =  var.enable_route53 ? 1 : 0
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = ["${aws_route53_record.cert_validation[count.index].fqdn}"]
}
