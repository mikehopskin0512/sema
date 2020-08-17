# Fetch vpc
data "aws_vpc" "main" {
  tags = {
    Name = var.vpc_name
  }
}

# Fetch AZs in the current region
data "aws_subnet_ids" "database" {
  vpc_id = data.aws_vpc.main.id
  tags = {
    Name = "vpc-${var.env}_database_*"
  }
}

# Create a subnet group in which DB instances can live
resource "aws_docdb_subnet_group" "main" {
  name       = "${var.name}-${var.env}"
  subnet_ids = data.aws_subnet_ids.database.ids

  tags = {
    Name = "${var.name}-${var.env}"
    Env  = var.env
    Terraform = true
  }
}

# Create the DB instance(s)
resource "aws_docdb_cluster_instance" "main" {
  count              = var.instance_count
  identifier         = "${var.name}-${var.env}-${count.index + 1}"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.instance_class

  tags = {
    Name = "${var.name}-${var.env}-${count.index + 1}"
    Env  = var.env
    Terraform = true
  }
}

# Create the DB cluster
resource "aws_docdb_cluster" "main" {
  skip_final_snapshot     = true
  db_subnet_group_name    = aws_docdb_subnet_group.main.name
  cluster_identifier      = "${var.name}-${var.env}"
  engine                  = "docdb"
  master_username         = "${replace(var.name, "-", "_")}_admin"
  master_password         = random_password.password.result
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.main.name
  vpc_security_group_ids = [aws_security_group.docdb.id]
  backup_retention_period = 7
  preferred_backup_window = "07:00-08:00"
  deletion_protection = true
  apply_immediately = true

  tags = {
    Name = "${var.name}-${var.env}"
    Env  = var.env
    Terraform = true
  }
}

# Create the DB parameter group for any customizations
resource "aws_docdb_cluster_parameter_group" "main" {
  family = "docdb3.6"
  name = "${var.name}-${var.env}"

  parameter {
    name  = "tls"
    value = "disabled"
  }

  tags = {
    Name = "${var.name}-${var.env}"
    Env  = var.env
    Terraform = true
  }
}