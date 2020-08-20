
# ---------------------------------------------------------------------------------------------------------------------
# FETCH EXISTING RESOURCES THAT WE NEED
# ---------------------------------------------------------------------------------------------------------------------
data "aws_vpc" "main" {
  tags = {
    Name = var.vpc_name
  }
}

data "aws_acm_certificate" "cert" {
  domain      = var.cert_domain
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}

data "aws_subnet_ids" "public" {
  vpc_id = data.aws_vpc.main.id
  tags = {
    Name = "vpc-${var.env}_public_*"
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# LOAD BALANCER SETUP
# ---------------------------------------------------------------------------------------------------------------------
resource "aws_lb" "main" {
  name                       = var.name
  internal                   = var.env == "qa" ? true : false
  load_balancer_type         = "application"
  subnets                    = data.aws_subnet_ids.public.ids
  security_groups            = [aws_security_group.lb.id]
  enable_deletion_protection = true

  tags = {
    Name = var.name
    Env  = var.env
    Terraform = true
  }
}

resource "aws_lb_listener" "main_http" {
  load_balancer_arn = aws_lb.main.id
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port = "443"
      protocol = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "main_https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = data.aws_acm_certificate.cert.arn

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Welcome to the jungle!"
      status_code  = "200"
    }
  }
}