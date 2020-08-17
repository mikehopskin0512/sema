output "https_listener" {
  value = aws_lb_listener.main_https.arn
}

output "alb_security_group" {
  value = aws_security_group.lb.id
}