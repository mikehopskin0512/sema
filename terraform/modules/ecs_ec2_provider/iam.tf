resource "aws_iam_instance_profile" "ec2" {
  name = local.ec2_profile_name
  role = aws_iam_role.ec2.name
}

resource "aws_iam_role" "ec2" {
  name = local.ec2_iam_role_name
  path = "/"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ec2.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "default_instance_ecs" {
  role       = aws_iam_role.ec2.name
  policy_arn = data.aws_iam_policy.instance.arn
}

resource "aws_iam_role_policy_attachment" "this" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
