resource "aws_launch_template" "main" {
  name = "${var.env}-${var.template_name}-lt"

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name      = "${var.env}-${var.template_name}-lt"
      Env       = var.env
      Terraform = true
    }
  }

  user_data = base64encode(data.template_file.main.rendered)
}

data "template_file" "main" {
  template = file("${path.module}/templates/${var.template_name}-mime.yml.tpl")

  vars = {
    efs_directory  = var.efs_host_path
    file_system_id = var.efs_file_system_id
  }
}
