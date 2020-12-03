resource "aws_sfn_state_machine" "scqp_state_machine" {
  name     = "${var.env}-${var.pipeline_name}"
  role_arn = aws_iam_role.sfn_execution_role.arn

  definition = data.template_file.scqp.rendered

  tags = {
    Name      = "${var.env}-${var.pipeline_name}"
    Env       = var.env
    Terraform = true
  }
}

# step function definition template
data "template_file" "scqp" {
  template = file("${path.module}/templates/orchestrator.json.tpl")

  vars = {
    env                 = var.env
    cluster_arn         = var.cluster_arn
  }
}