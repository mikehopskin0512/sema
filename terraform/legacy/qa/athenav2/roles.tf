locals {
    role_name = "qa-athena"
    environment  = "qa"
}

module "batch_roles" {
    source = "../../../modules/iam-roles"

    batch_role_name = local.role_name
    env             = local.environment
    ecs_role_name   = local.role_name
}

module "sFn_roles" {
    source = "../../../modules/iam-roles"

    env           = local.environment
    sfn_role_name = local.role_name
}