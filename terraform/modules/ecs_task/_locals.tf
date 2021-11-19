locals {
  task_definition                      = "${var.name_prefix}-${var.application}"
  service                              = var.application
  task_definition_role                 = "${local.task_definition}-role"
  task_definition_extra_policy         = "${local.task_definition}-extra-policy"
  task_definition_exec_role            = "${local.task_definition}-exec-role"
  task_definition_exec_ecr_policy      = "${local.task_definition}-ecr-policy"
  task_definition_exec_cw_policy       = "${local.task_definition}-cw-policy"
  task_definition_exec_ssm_policy      = "${local.task_definition}-ssm-policy"
  task_definition_exec_secret_policy   = "${local.task_definition}-secret-policy"
  task_definition_exec_external_policy = "${local.task_definition}-external-policy"
  cw_log_group                         = "/${var.name_prefix}/ecs/${var.application}"
  sg                                   = "${local.task_definition}-sg"
}

locals {
  ecs_secrets = flatten([
    for secret in var.ecs_secrets : [
      for key in secret.envs :
      {
        name      = key
        valueFrom = "${secret.valueFrom}:${key}::"
      }
    ]
  ])
  ssm_params_arns = distinct(compact([
    for secret in var.ecs_secrets :
    can(regex("^arn\\:aws\\:ssm", secret.valueFrom)) ? secret.valueFrom : null
  ]))
  secrets_manager_arns = distinct(compact([
    for secret in var.ecs_secrets :
    can(regex("^arn\\:aws\\:secretsmanager", secret.valueFrom)) ? secret.valueFrom : null
  ]))
  secrets_kms_arns = distinct(compact([
    for secret in var.ecs_secrets :
    can(regex("^arn\\:aws\\:kms", secret.kms)) ? secret.kms : null
  ]))
  create_secret_policy  = length(var.ecs_secrets) > 0 ? true : false
  create_ecr_kms_policy = var.ecr_repo.kms_key != "" ? true : false
  cw_logs_encrypted     = var.cw_kms_key != null ? true : false
}

locals {
  domain                      = "${var.ecs_external_access.domain_prefix}.${var.ecs_external_access.domain}"
  requires_compatibilities    = var.requires_compatibilities_ec2_enabled ? ["EC2"] : ["FARGATE"]
  ecs_external_access_enabled = var.ecs_external_access != null ? true : false
  ecs_port_mappings           = local.ecs_external_access_enabled ? [{ containerPort = var.ecs_external_access.port }] : []
  ecs_command                 = var.ecs_command != null ? var.ecs_command : []
  ecs_container_definitions = jsonencode([
    {
      name         = var.application,
      image        = "${var.image}",
      cpu          = var.task_definition_resources.cpu,
      memory       = var.task_definition_resources.memory,
      essential    = true,
      portMappings = local.ecs_port_mappings,
      environment  = var.ecs_envs,
      secrets      = local.ecs_secrets,
      command      = local.ecs_command,
      logConfiguration = {
        logDriver     = "awslogs",
        secretOptions = null,
        options = {
          awslogs-group         = aws_cloudwatch_log_group.this.name,
          awslogs-region        = data.aws_region.current.name,
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

locals {
  service_tags = merge(
    {
      "Name" = local.service
    },
    var.service_tags
  )
  cw_tags = merge(
    {
      "Name" = local.cw_log_group
    },
    var.cw_tags
  )
  sg_tags = merge(
    {
      "Name" = local.sg
    },
    var.sg_tags
  )
  task_definition_tags = merge(
    {
      "Name" = local.task_definition
    },
    var.task_definition_tags
  )
}
