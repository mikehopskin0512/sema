output "https_listener" {
  value = aws_lb_listener.main_https.arn
}

output "alb_security_group" {
  value = aws_security_group.lb.id
}

output "alb_domain" {
  value = aws_lb.main.dns_name
}

output "alb_zone_id" {
  value = aws_lb.main.zone_id
}
