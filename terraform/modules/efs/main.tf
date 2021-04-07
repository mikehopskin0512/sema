data "aws_vpc" "main" {
  tags = {
    Name = var.vpc_name
  }
}

data "aws_subnet_ids" "private" {
  vpc_id = data.aws_vpc.main.id
  tags = {
    Name = "vpc-${var.env}_private_*"
  }
}

data "aws_security_group" "private" {
  vpc_id = data.aws_vpc.main.id
  tags = {
    Name = "${var.env}-private-sg"
  }
}

resource "aws_efs_file_system" "main" {

  performance_mode = "generalPurpose"
  throughput_mode  = "bursting"
  encrypted        = true

  lifecycle_policy {
    transition_to_ia = "AFTER_7_DAYS"
  }

  tags = {
    Name      = "${var.env}-${var.efs_name}"
    Env       = var.env
    Terraform = true
  }
}

resource "aws_efs_mount_target" "mount" {
  count           = 3
  file_system_id  = aws_efs_file_system.main.id
  subnet_id       = sort(data.aws_subnet_ids.private.ids)[count.index]
  security_groups = [aws_security_group.efs-sg.id, data.aws_security_group.private.id]
}

resource "aws_security_group" "efs-sg" {
  name        = "${var.env}-${var.efs_name}-efs-sg"
  description = "Allow NFS traffic."
  vpc_id      = data.aws_vpc.main.id

  // Allow inbound traffic on NFS port
  ingress {
    security_groups = [data.aws_security_group.private.id]
    from_port       = 2049
    to_port         = 2049
    protocol        = "tcp"
  }

  egress {
    security_groups = [data.aws_security_group.private.id]
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
  }
}

resource "aws_efs_access_point" "main" {
  file_system_id = aws_efs_file_system.main.id
  root_directory {
    path = "/${var.access_point_name}"
  }

  tags = {
    Name      = "${var.env}-${var.access_point_name}"
    Env       = var.env
    Terraform = true
  }
}
