# ---------------------------------------------------------------------------------------------------------------------
# ALLOW HTTP AND HTTPS TRAFFIC THRU THE LOAD BALANCER
# ---------------------------------------------------------------------------------------------------------------------
resource "aws_security_group" "lb" {
  name        = "${var.env}-lb-sg"
  description = "controls access to the ALB"
  vpc_id      = data.aws_vpc.main.id

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name      = "${var.env}-lb-sg"
    Env       = var.env
    Terraform = true
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# ADD VPN CIDR ACCESS TO THE LOAD BALANCER SECURITY GROUP (FOR VPC PEERING)
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_security_group_rule" "tcp" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lb.id

  depends_on = [aws_security_group.lb]
}

resource "aws_security_group_rule" "tls" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lb.id

  depends_on = [aws_security_group.lb]
}

resource "aws_security_group_rule" "vpn" {
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["10.0.0.90/32"]
  security_group_id = aws_security_group.lb.id

  depends_on = [aws_security_group.lb]
}
