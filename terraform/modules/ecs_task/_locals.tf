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
  task_definition_external_policy      = "${local.task_definition}-external-policy"
  task_definition_exec_external_policy = "${local.task_definition}-external-exec-policy"
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
  domain_prefix               = can(var.ecs_external_access.domain_prefix) ? var.ecs_external_access.domain_prefix : ""
  ecs_external_access_domain  = can(var.ecs_external_access.domain) ? var.ecs_external_access.domain : ""
  domain                      = "${local.domain_prefix}.${local.ecs_external_access_domain}"
  requires_compatibilities    = var.requires_compatibilities_ec2_enabled ? ["EC2"] : ["FARGATE"]
  ecs_external_access_enabled = var.ecs_external_access != null
  ecs_port_mappings           = local.ecs_external_access_enabled ? [{ containerPort = var.ecs_external_access.port }] : []
  ecs_command                 = var.ecs_command != null ? var.ecs_command : []
  datadog_enabled             = length(compact([null, "", var.datadog_api_key])) > 0 ? true : false
  gpu_enabled                 = length(compact([null, "", var.gpu])) > 0 ? true : false
  ecs_main_container_cpu      = local.datadog_enabled ? var.task_definition_resources_cpu - 124 : var.task_definition_resources_cpu
  ecs_main_container_memory   = local.datadog_enabled ? var.task_definition_resources_memory - 124 : var.task_definition_resources_memory

  log_configuration = local.datadog_enabled ? jsonencode({
    logDriver = "awsfirelens",
    options = {
      Name       = "datadog",
      apiKey     = var.datadog_api_key,
      dd_service = "${var.name_prefix}-${var.application}-service",
      dd_source  = "${var.name_prefix}-${var.application}",
      dd_tags    = "Env:${var.name_prefix}",
      TLS        = "on",
      provider   = "ecs"
    } }) : jsonencode({
    logDriver     = "awslogs",
    secretOptions = null,
    options = {
      awslogs-group         = aws_cloudwatch_log_group.this.name,
      awslogs-region        = data.aws_region.current.name,
      awslogs-stream-prefix = "ecs"
    }
  })

  gpu_configuration = local.gpu_enabled ? [{
    type  = "GPU",
    value = "${var.gpu}"
    },
  ] : null
  ecs_main_container = [
    merge(
      {
        name                 = var.application,
        image                = "${var.image}",
        cpu                  = local.ecs_main_container_cpu,
        resourceRequirements = "${local.gpu_configuration}",
        essential            = true,
        portMappings         = local.ecs_port_mappings,
        environment          = var.ecs_envs,
        secrets              = local.ecs_secrets,
        command              = local.ecs_command,
        logConfiguration     = jsondecode(local.log_configuration)
      },
      local.ecs_main_container_memory != null ? { memory = local.ecs_main_container_memory } : null
    )
  ]

  ecs_container_definitions = local.datadog_enabled ? jsonencode(concat(local.ecs_main_container, [
    {
      name         = "log_router",
      image        = "public.ecr.aws/aws-observability/aws-for-fluent-bit:stable"
      essential    = true
      cpu          = 124
      memory       = 124
      environment  = []
      mountPoints  = []
      portMappings = []
      volumesFrom  = []
      user         = "0"
      logConfiguration = {
        logDriver     = "awslogs",
        secretOptions = null,
        options = {
          awslogs-group         = aws_cloudwatch_log_group.this.name,
          awslogs-region        = data.aws_region.current.name,
          awslogs-stream-prefix = "ecs"
        }
      }
      firelensConfiguration = {
        type = "fluentbit",
        options = {
          enable-ecs-log-metadata = "true"
        }
      }
    }
    ]
  )) : jsonencode(local.ecs_main_container)

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
