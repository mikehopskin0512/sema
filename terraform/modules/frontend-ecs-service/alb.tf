#Fetch vpc
data "aws_vpc" "main" {
  tags = {
    Name = var.vpc_name
  }
}

data "aws_lb_listener" "https" {
  arn = var.lb_listener_arn
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE A TARGET GROUP TO SEND TRAFFIC TO AND A LOAD BALANCER RULE TO ROUTE THE TRAFFIC
# BASED ON THE REQUESTED HOST NAME.  THIS ALLOWS US TO SERVE MULTIPLE DOMAINS VIA A 
# SINGLE LOAD BALANCER.  
# ---------------------------------------------------------------------------------------------------------------------
resource "aws_lb_target_group" "service" {
  name        = "${var.env}-${var.service_name}"
  port        = var.port
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.main.id
  target_type = "ip"
  
  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = var.health_check_path
    unhealthy_threshold = "2"
  }
}

resource "aws_lb_listener_rule" "service_routing" {
  listener_arn = data.aws_lb_listener.https.arn

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service.arn
  }

  condition {
    host_header {
      values = [var.domain]
    }
  }
}
