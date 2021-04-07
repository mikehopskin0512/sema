# create a step function
resource "aws_sfn_state_machine" "main" {
  name     = "${var.env}-${var.workflow_name}"
  role_arn = var.role_arn

  definition = data.template_file.main.rendered

  tags = {
    Name      = "${var.env}-${var.workflow_name}"
    Env       = var.env
    Terraform = true
  }
}

# step function definition template
data "template_file" "main" {
  template = file("${path.module}/templates/${var.workflow_name}.json")

  vars = {
    env            = var.env
    job_definition = var.batch_job_definition
    job_queue      = var.batch_job_queue
  }
}
