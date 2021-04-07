locals {
    access_point = "customer-repos"
    host_path    = "/mnt/efs"
    environment  = "qa"
    vpc          = "vpc-qa"
    key_name     = "phoenix_qa"
}

module "efs" {
    source = "../../../modules/efs"

    access_point_name = local.access_point
    efs_name          = "athena"
    env               = local.environment
    vpc_name          = local.vpc
}

module "efs_launch_template" {
    source = "../../../modules/launch-template"

    efs_file_system_id = module.efs.file_system_id
    efs_host_path      = local.host_path
    template_name      = "efs"
    env                = local.environment
}

module "batch_eric" {
    source = "../../../modules/batch"

    batch_name              = "eric"
    batch_policy_attachment = module.batch_roles.batch_policy_attachment
    batch_service_role      = module.batch_roles.batch_service_role
    efs_container_path      = local.access_point
    efs_host_path           = local.host_path
    env                     = local.environment
    image                   = "091235034633.dkr.ecr.us-east-1.amazonaws.com/athena-eric:latest"
    instance_profile_role   = module.batch_roles.ecs_instance_profile_role
    launch_template_id      = module.efs_launch_template.launch_template_id
    ssh_key                 = local.key_name
    vpc_name                = local.vpc
}

module "batch_janus" {
    source = "../../../modules/batch"

    batch_name              = "janus"
    batch_policy_attachment = module.batch_roles.batch_policy_attachment
    batch_service_role      = module.batch_roles.batch_service_role
    efs_container_path      = local.access_point
    efs_host_path           = local.host_path
    env                     = local.environment
    image                   = "091235034633.dkr.ecr.us-east-1.amazonaws.com/athena-janus:latest"
    instance_profile_role   = module.batch_roles.ecs_instance_profile_role
    launch_template_id      = module.efs_launch_template.launch_template_id
    ssh_key                 = local.key_name
    vpc_name                = local.vpc
}

module "batch_momus" {
    source = "../../../modules/batch"

    batch_name              = "momus"
    batch_policy_attachment = module.batch_roles.batch_policy_attachment
    batch_service_role      = module.batch_roles.batch_service_role
    efs_container_path      = local.access_point
    efs_host_path           = local.host_path
    env                     = local.environment
    image                   = "091235034633.dkr.ecr.us-east-1.amazonaws.com/athena-momus:latest"
    instance_profile_role   = module.batch_roles.ecs_instance_profile_role
    launch_template_id      = module.efs_launch_template.launch_template_id
    ssh_key                 = local.key_name
    vpc_name                = local.vpc
}

module "batch_wc" {
    source = "../../../modules/batch"

    batch_name              = "word_count"
    batch_policy_attachment = module.batch_roles.batch_policy_attachment
    batch_service_role      = module.batch_roles.batch_service_role
    efs_container_path      = local.access_point
    efs_host_path           = local.host_path
    env                     = local.environment
    image                   = "091235034633.dkr.ecr.us-east-1.amazonaws.com/athena-wc:latest"
    instance_profile_role   = module.batch_roles.ecs_instance_profile_role
    launch_template_id      = module.efs_launch_template.launch_template_id
    ssh_key                 = local.key_name
    vpc_name                = local.vpc
}

module "batch_mime" {
    source = "../../../modules/batch"

    batch_name              = "mime"
    batch_policy_attachment = module.batch_roles.batch_policy_attachment
    batch_service_role      = module.batch_roles.batch_service_role
    efs_container_path      = local.access_point
    efs_host_path           = local.host_path
    env                     = local.environment
    image                   = "091235034633.dkr.ecr.us-east-1.amazonaws.com/athena-mime:latest"
    instance_profile_role   = module.batch_roles.ecs_instance_profile_role
    launch_template_id      = module.efs_launch_template.launch_template_id
    ssh_key                 = local.key_name
    vpc_name                = local.vpc
}

module "batch_enry" {
    source = "../../../modules/batch"

    batch_name              = "enry"
    batch_policy_attachment = module.batch_roles.batch_policy_attachment
    batch_service_role      = module.batch_roles.batch_service_role
    efs_container_path      = local.access_point
    efs_host_path           = local.host_path
    env                     = local.environment
    image                   = "091235034633.dkr.ecr.us-east-1.amazonaws.com/athena-enry:latest"
    instance_profile_role   = module.batch_roles.ecs_instance_profile_role
    launch_template_id      = module.efs_launch_template.launch_template_id
    ssh_key                 = local.key_name
    vpc_name                = local.vpc
}