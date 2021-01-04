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

resource "aws_batch_compute_environment" "main" {
  compute_environment_name_prefix = "${var.env}-${var.batch_name}-"

  compute_resources {
    ec2_key_pair = var.ssh_key

    instance_role = var.instance_profile_role

    instance_type = [
      "optimal",
    ]

    launch_template {
      launch_template_id = var.launch_template_id
      version            = "$Latest"
    }


    max_vcpus = 256
    min_vcpus = 0

    security_group_ids = [
      data.aws_security_group.private.id,
    ]

    subnets = data.aws_subnet_ids.private.ids

    type = "EC2"

    tags = {
      Env       = var.env
      Terraform = true
    }
  }

  lifecycle {
    create_before_destroy = true
  }

  service_role = var.batch_service_role
  type         = "MANAGED"
  depends_on   = [var.batch_policy_attachment]

  tags = {
    Name      = "${var.env}-${var.batch_name}-compute-environment"
    Env       = var.env
    Terraform = true
  }
}

resource "aws_batch_job_queue" "main" {
  name     = "${var.env}-${var.batch_name}-job-queue"
  state    = "ENABLED"
  priority = 1000
  compute_environments = [
    "${aws_batch_compute_environment.main.arn}"
  ]

  tags = {
    Name      = "${var.env}-${var.batch_name}-job-queue"
    Env       = var.env
    Terraform = true
  }
}

resource "aws_batch_job_definition" "main" {
  name = "${var.env}-${var.batch_name}-job-definition"
  type = "container"

  container_properties = data.template_file.batch.rendered

  tags = {
    Name      = "${var.env}-${var.batch_name}-job-definition"
    Env       = var.env
    Terraform = true
  }
}

data "template_file" "batch" {
  template = file("${path.module}/templates/${var.batch_name}.json.tpl")

  vars = {
    image          = var.image
    container_path = var.efs_container_path
    host_path      = var.efs_host_path
  }
}
