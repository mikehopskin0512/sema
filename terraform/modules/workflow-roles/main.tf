# ---------------------------------------------------------------------------------------------------------------------
# CREATE THE NECESSARY ECS ROLES AND POLICIES
# ---------------------------------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "ecs_instance_role" {
  version = "2012-10-17"
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_instance_role" {
  count              = var.ecs_role_name == "default_null" ? 0 : 1
  name               = "${var.ecs_role_name}-InstanceRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_instance_role.json

  tags = {
    Env       = var.env
    Terraform = true
  }
}

resource "aws_iam_role_policy_attachment" "ecs_instance_role" {
  count      = var.ecs_role_name == "default_null" ? 0 : 1
  role       = aws_iam_role.ecs_instance_role[count.index].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs_instance_role" {
  count = var.ecs_role_name == "default_null" ? 0 : 1
  name  = "${var.ecs_role_name}-InstanceRole"
  role  = aws_iam_role.ecs_instance_role[count.index].name
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE THE NECESSARY AWS BATCH ROLES AND POLICIES
# ---------------------------------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "aws_batch_service_role" {
  version = "2012-10-17"
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["batch.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "aws_batch_service_role" {
  count              = var.batch_role_name == "default_null" ? 0 : 1
  name               = "${var.batch_role_name}-BatchServiceRole"
  assume_role_policy = data.aws_iam_policy_document.aws_batch_service_role.json

  tags = {
    Env       = var.env
    Terraform = true
  }
}

resource "aws_iam_role_policy_attachment" "aws_batch_service_role" {
  count      = var.batch_role_name == "default_null" ? 0 : 1
  role       = aws_iam_role.aws_batch_service_role[count.index].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBatchServiceRole"
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE THE NECESSARY STEP FUNCTION ROLES AND POLICIES
# ---------------------------------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "sfn_execution_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["states.${var.aws_region}.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "sfn_execution_role" {
  count              = var.sfn_role_name == "default_null" ? 0 : 1
  name               = "${var.sfn_role_name}-SFnExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.sfn_execution_role.json

  tags = {
    Env       = var.env
    Terraform = true
  }
}

# Allow step functions to invoke batch
data "aws_iam_policy_document" "batch_invoke" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "batch:SubmitJob",
      "batch:DescribeJobs",
      "batch:ListJobs",
      "events:PutTargets",
      "events:PutRule",
      "events:DescribeRule"
    ]
    resources = [
      "*",
    ]
  }
}

resource "aws_iam_policy" "batch_invoke" {
  count  = var.sfn_role_name == "default_null" ? 0 : 1
  name   = "${var.sfn_role_name}-BatchInvoke"
  policy = data.aws_iam_policy_document.batch_invoke.json
}

resource "aws_iam_role_policy_attachment" "batch_invoke" {
  count      = var.sfn_role_name == "default_null" ? 0 : 1
  role       = aws_iam_role.sfn_execution_role[count.index].name
  policy_arn = aws_iam_policy.batch_invoke[count.index].arn
}

