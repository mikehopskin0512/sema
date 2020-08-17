
# ---------------------------------------------------------------------------------------------------------------------
# SETUP CLOUDWATCH LOGS
# ---------------------------------------------------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "web_log_group" {
  name              = "/${var.env}/ecs/${var.service_name}"
  retention_in_days = 30

  tags = {
    Name = "web-log-group"
  }
}

resource "aws_cloudwatch_log_stream" "web_log_stream" {
  name           = "${var.env}-${var.service_name}-log-stream"
  log_group_name = aws_cloudwatch_log_group.web_log_group.name
}