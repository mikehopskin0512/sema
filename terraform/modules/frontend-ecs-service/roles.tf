# ECS task execution role data
data "aws_iam_policy_document" "ecs_task_execution_role" {
  version = "2012-10-17"
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# ECS task execution role
resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.env}-${var.service_name}-EcsTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_role.json
}

# ECS task execution role policy attachment
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

#Grant role access to the AWS parameter store for ENV variables
data "aws_iam_policy_document" "param_store_policy" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "ssm:*"
    ]
    resources = [
      "*",
    ]
  }
}

resource "aws_iam_policy" "param_store_policy" {
  name   = "${var.env}-${var.service_name}-parameter-store-policy"
  policy = data.aws_iam_policy_document.param_store_policy.json
}

resource "aws_iam_role_policy_attachment" "param_store_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.param_store_policy.arn
}

#Grant role for exec
data "aws_iam_policy_document" "exec_policy_document" {
    version ="2012-10-17"
    statement {
       effect = "Allow"
       actions = [
            "ssmmessages:CreateControlChannel",
            "ssmmessages:CreateDataChannel",
            "ssmmessages:OpenControlChannel",
            "ssmmessages:OpenDataChannel"
       ]

      resources = [
      "*",
    ]
    }
}

resource "aws_iam_policy" "exec_policy" {
  name   = "${var.env}-${var.service_name}-exec-policy"
  policy = data.aws_iam_policy_document.exec_policy_document.json
}

resource "aws_iam_role_policy_attachment" "exec_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.exec_policy.arn
}
# resource "aws_iam_role_policy" "sns_policy" {
#   name   = "${var.env}-${var.service_name}-sns-policy"
#   role   = aws_iam_role.ecs_task_execution_role.name
#   policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Action": [
#         "sns:Publish"
#       ],
#       "Effect": "Allow",
#       "Resource": "*"
#     }
#   ]
# }
# EOF
# }
