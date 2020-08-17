# Fetch private security groups from within VPC
data "aws_security_groups" "db" {
  filter {
    name   = "group-name"
    values = ["*private*", "*apollo*"]
  }
}

# Traffic to the DB cluster should only come from within the VPC
resource "aws_security_group" "docdb" {
  name        = "${var.env}-docdb-sg"
  description = "allow inbound access from within the VPC only"
  vpc_id      = data.aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = 27017
    to_port         = 27017
    security_groups = data.aws_security_groups.db.ids
  }

  ingress {
    protocol        = "tcp"
    from_port       = 27017
    to_port         = 27017
    cidr_blocks     = ["10.0.0.90/32"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.name}-${var.env}"
    Env  = var.env
    Terraform = true
  }
}