# Allow public http traffic
resource "aws_security_group" "public" {
  name        = "${var.env}-public-sg"
  description = "Allow inbound HTTP traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.env}-public-sg"
    Env  = var.env
    Terraform = true
  }
}

# Allow private traffic
resource "aws_security_group" "private" {
  name        = "${var.env}-private-sg"
  description = "Allow private traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 22
    to_port     = 22
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.env}-private-sg"
    Env  = var.env
    Terraform = true
  }
}

# Allow VPN traffic
resource "aws_security_group" "vpn" {
  name        = "${var.env}-vpn-sg"
  description = "Allow vpn traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["10.0.0.90/32"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.env}-vpn-sg"
    Env  = var.env
    Terraform = true
  }
}
