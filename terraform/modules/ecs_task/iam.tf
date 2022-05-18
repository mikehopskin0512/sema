resource "aws_iam_role" "execution" {
  name               = substr(local.task_definition_exec_role, 0, 64)
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "ecr" {
  name   = local.task_definition_exec_ecr_policy
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.ecr.json
}

resource "aws_iam_role_policy" "cw" {
  name   = local.task_definition_exec_cw_policy
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.cw.json
}

resource "aws_iam_role_policy" "ssm" {
  name   = local.task_definition_exec_ssm_policy
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.ssm.json
}

resource "aws_iam_role_policy" "secret" {
  count  = local.create_secret_policy ? 1 : 0
  name   = local.task_definition_exec_secret_policy
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.secret[0].json
}

resource "aws_iam_role" "task" {
  name               = substr(local.task_definition_role, 0, 64)
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "external" {
  count  = length(var.external_iam_policies)
  name   = "${local.task_definition_external_policy}-${count.index}"
  role   = aws_iam_role.task.id
  policy = element(var.external_iam_policies, count.index)
}

resource "aws_iam_role_policy" "external_exec" {
  count  = length(var.external_exec_iam_policies)
  name   = "${local.task_definition_exec_external_policy}-${count.index}"
  role   = aws_iam_role.execution.id
  policy = element(var.external_exec_iam_policies, count.index)
}

resource "aws_iam_role_policy" "ssm_task" {
  name   = local.task_definition_exec_ssm_policy
  role   = aws_iam_role.task.id
  policy = data.aws_iam_policy_document.ssm.json
}
