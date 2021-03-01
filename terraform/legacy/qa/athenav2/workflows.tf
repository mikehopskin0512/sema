locals {
    environment  = "qa"
}

module "eric" {
    source = "../../../modules/workflow"

    batch_job_definition  = module.batch_eric.job_definition
    batch_job_queue       = module.batch_eric.job_queue
    env                   = local.environment
    role_arn              = module.sFn_roles.sfn_execution_role
    workflow_name         = "eric"
}

module "janus" {
    source = "../../../modules/workflow"

    batch_job_definition  = module.batch_janus.job_definition
    batch_job_queue       = module.batch_janus.job_queue
    env                   = local.environment
    role_arn              = module.sFn_roles.sfn_execution_role
    workflow_name         = "janus"
}

module "momus" {
    source = "../../../modules/workflow"

    batch_job_definition  = module.batch_momus.job_definition
    batch_job_queue       = module.batch_momus.job_queue
    env                   = local.environment
    role_arn              = module.sFn_roles.sfn_execution_role
    workflow_name         = "momus"
}

module "word_count" {
    source = "../../../modules/workflow"

    batch_job_definition  = module.batch_wc.job_definition
    batch_job_queue       = module.batch_wc.job_queue
    env                   = local.environment
    role_arn              = module.sFn_roles.sfn_execution_role
    workflow_name         = "word_count"
}

module "mime" {
    source = "../../../modules/workflow"

    batch_job_definition  = module.batch_mime.job_definition
    batch_job_queue       = module.batch_mime.job_queue
    env                   = local.environment
    role_arn              = module.sFn_roles.sfn_execution_role
    workflow_name         = "mime"
}

module "enry" {
    source = "../../../modules/workflow"

    batch_job_definition  = module.batch_enry.job_definition
    batch_job_queue       = module.batch_enry.job_queue
    env                   = local.environment
    role_arn              = module.sFn_roles.sfn_execution_role
    workflow_name         = "enry"
}