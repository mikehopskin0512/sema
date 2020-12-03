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
  name               = "${var.env}-${var.pipeline_name}-SFnExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.sfn_execution_role.json

  tags = {
    Env       = var.env
    Terraform = true
  }
}

# Allow step functions to invoke batch
data "aws_iam_policy_document" "ecs_invoke" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "ecs:RunTask",
      "ecs:StopTask",
      "ecs:DescribeTasks",
      "events:PutTargets",
      "events:PutRule",
      "events:DescribeRule"
    ]
    resources = [
      "*",
    ]
  }
}

resource "aws_iam_policy" "ecs_invoke" {
  name   = "${var.env}-${var.pipeline_name}-EcsInvoke"
  policy = data.aws_iam_policy_document.ecs_invoke.json
}

resource "aws_iam_role_policy_attachment" "ecs_invoke" {
  role       = aws_iam_role.sfn_execution_role.name
  policy_arn = aws_iam_policy.ecs_invoke.arn
}
