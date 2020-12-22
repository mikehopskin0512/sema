module "batch_roles" {
  source = "./modules/iam-roles"

  batch_role_name = "${var.env}-${var.pipeline_name}"
  env             = var.env
  ecs_role_name   = "${var.env}-${var.pipeline_name}"
}

module "sFn_roles" {
  source = "./modules/iam-roles"

  env           = var.env
  sfn_role_name = "${var.env}-${var.pipeline_name}"
}

module "efs" {
  source = "./modules/efs"

  access_point_name = var.efs_access_point_name
  efs_name          = var.pipeline_name
  env               = var.env
  vpc_name          = var.vpc_name
}

module "efs_launch_template" {
  source = "./modules/launch-template"

  efs_file_system_id = module.efs.file_system_id
  efs_host_path      = var.efs_host_path
  template_name      = "efs"
  env                = var.env
}

module "batch_eric" {
  source = "./modules/aws-batch"

  batch_name              = "eric"
  batch_policy_attachment = module.batch_roles.batch_policy_attachment
  batch_service_role      = module.batch_roles.batch_service_role
  efs_container_path      = "/${var.efs_access_point_name}"
  efs_host_path           = var.efs_host_path
  env                     = var.env
  image                   = var.eric_image
  instance_profile_role   = module.batch_roles.ecs_instance_profile_role
  launch_template_id      = module.efs_launch_template.launch_template_id
  ssh_key                 = var.batch_ssh_key
  vpc_name                = var.vpc_name
}

resource "aws_sfn_state_machine" "athena_state_machine" {
  name     = "${var.env}-${var.pipeline_name}"
  role_arn = module.sFn_roles.sfn_execution_role

  definition = data.template_file.athena.rendered

  tags = {
    Name      = "${var.env}-${var.pipeline_name}"
    Env       = var.env
    Terraform = true
  }
}

# step function definition template
data "template_file" "athena" {
  template = file("${path.module}/templates/${var.pipeline_name}.json")

  vars = {
    env                 = var.env
    eric_job_definition = module.batch_eric.job_definition
    eric_job_queue      = module.batch_eric.job_queue
  }
}
