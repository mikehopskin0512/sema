
# Fetch private subnets in the current region
data "aws_subnet_ids" "private" {
  vpc_id = data.aws_vpc.main.id
  tags = {
    Name = "*${var.env}*private*"
  }
}

data "aws_ecs_cluster" "main" {
  cluster_name = var.cluster_name
}

# ---------------------------------------------------------------------------------------------------------------------
# SETUP THE SERVICE AND TASKS
# ---------------------------------------------------------------------------------------------------------------------
data "template_file" "service" {
  template = file("${path.module}/templates/${var.service_name}.json.tpl")

  vars = {
    image            = var.image
    port             = var.port
    container_cpu    = var.cpu
    container_memory = var.memory
    aws_region       = var.aws_region
    env              = var.env
    container_name   = var.service_name
  }
}

resource "aws_ecs_task_definition" "service" {
  family                   = "${var.env}-${var.service_name}"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  container_definitions    = data.template_file.service.rendered
}

resource "aws_ecs_service" "service" {
  name                   = var.service_name
  cluster                = data.aws_ecs_cluster.main.id
  enable_execute_command = true
  task_definition        = aws_ecs_task_definition.service.arn
  desired_count          = var.task_count
  launch_type            = "FARGATE"
  platform_version       = "1.4.0"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = data.aws_subnet_ids.private.ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.service.id
    container_name   = var.service_name
    container_port   = var.port
  }

  depends_on = [data.aws_lb_listener.https, aws_iam_role_policy_attachment.ecs_task_execution_role]
}
