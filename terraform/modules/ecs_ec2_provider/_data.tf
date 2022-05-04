data "aws_ami" "ecs_image" {
  most_recent = true
  name_regex  = "amzn2-ami-ecs-hvm-.*-x86_64-ebs"
  owners      = ["591542846629"]
}

data "aws_subnet" "this" {
  id = var.vpc_subnet_ids[0]
}

data "template_file" "this" {
  template = file("${path.module}/user_data/user_data.tpl")
  vars = {
    ecs_cluster_name = "${var.ecs_cluster_name}"
  }
}

data "aws_iam_policy" "instance" {
  name = "AmazonEC2ContainerServiceforEC2Role"
}
