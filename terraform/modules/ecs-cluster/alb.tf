#Fetch vpc
data "aws_vpc" "main" {
  tags = {
    Name = var.vpc_name
  }
}

# Fetch AZs in the current region
data "aws_subnet_ids" "public" {
  vpc_id = data.aws_vpc.main.id
  tags = {
    Name = "vpc-${var.env}_public_*"
  }
}

resource "aws_alb" "main" {
  name            = "${var.env}-${var.cluster_name}"
  subnets         = data.aws_subnet_ids.public.ids
  security_groups = [aws_security_group.lb.id]
  internal = var.env == "qa" ? true : false
}

resource "aws_alb_target_group" "app" {
  name        = "${var.env}-${var.cluster_name}"
  port        = 3000
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

# Redirect all traffic from the ALB to the target group
resource "aws_alb_listener" "front_end" {
  load_balancer_arn = aws_alb.main.id
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.app.id
    type             = "forward"
  }
}
