# logs.tf

# Set up CloudWatch group and log stream and retain logs for 30 days
resource "aws_cloudwatch_log_group" "web_log_group" {
  name              = "/ecs/${var.env}-${var.cluster_name}"
  retention_in_days = 30

  tags = {
    Name = "web-log-group"
  }
}

resource "aws_cloudwatch_log_stream" "web_log_stream" {
  name           = "${var.env}-${var.cluster_name}-log-stream"
  log_group_name = aws_cloudwatch_log_group.web_log_group.name
}
