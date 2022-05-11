resource "aws_ecs_task_definition" "this" {
  container_definitions    = local.ecs_container_definitions
  family                   = local.task_definition
  cpu                      = var.task_definition_resources_cpu
  memory                   = var.task_definition_resources_memory
  network_mode             = "awsvpc"
  requires_compatibilities = local.requires_compatibilities
  task_role_arn            = aws_iam_role.task.arn
  execution_role_arn       = aws_iam_role.execution.arn
  tags                     = local.task_definition_tags

  dynamic "ephemeral_storage" {
    for_each = length(compact([null, "", var.ephemeral_storage])) > 0 ? ["created"] : []
    content {
      size_in_gib = var.ephemeral_storage
    }
  }
}
