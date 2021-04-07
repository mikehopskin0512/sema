# module "batch_roles" {
#     source = "../../../modules/iam-roles"

#     batch_role_name = "qa-athena"
#     env             = "qa"
#     ecs_role_name   = "qa-athena"
# }

# module "sFn_roles" {
#     source = "../../../modules/iam-roles"

#     env           = "qa"
#     sfn_role_name = "qa-athena"
# }

# module "efs" {
#     source = "../../../modules/efs"

#     access_point_name = "customer-repos"
#     efs_name          = "athena"
#     env               = "qa"
#     vpc_name          = "vpc-qa"
# }

# module "efs_launch_template" {
#     source = "../../../modules/launch-template"

#     efs_file_system_id = module.efs.file_system_id
#     efs_host_path      = "/mnt/efs"
#     template_name      = "efs"
#     env                = "qa"
# }

# module "batch_eric" {
#     source = "../../../modules/batch"

#     batch_name              = "eric"
#     batch_policy_attachment = module.batch_roles.batch_policy_attachment
#     batch_service_role      = module.batch_roles.batch_service_role
#     efs_container_path      = "/customer-repos"
#     efs_host_path           = "/mnt/efs"
#     env                     = "qa"
#     image                   = "091235034633.dkr.ecr.us-east-1.amazonaws.com/athena-eric:latest"
#     instance_profile_role   = module.batch_roles.ecs_instance_profile_role
#     launch_template_id      = module.efs_launch_template.launch_template_id
#     ssh_key                 = "phoenix_qa"
#     vpc_name                = "vpc-qa"
# }

# module "eric" {
#     source = "../../../modules/workflow"

#     batch_job_definition  = module.batch_eric.job_definition
#     batch_job_queue       = module.batch_eric.job_queue
#     env                   = "qa"
#     role_arn              = module.sFn_roles.sfn_execution_role
#     workflow_name         = "eric"
# }