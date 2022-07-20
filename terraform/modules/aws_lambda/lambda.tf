resource "aws_lambda_function" "this" {
  function_name = local.lambda_function
  description   = var.description
  publish       = var.publish
  runtime       = var.runtime

  filename         = data.archive_file.function.output_path
  source_code_hash = data.archive_file.function.output_base64sha256
  handler          = var.lambda_handler

  role = aws_iam_role.this.arn

  memory_size = var.memory_size
  timeout     = var.timeout

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [aws_security_group.this.id]
  }

  dynamic "environment" {
    for_each = length(var.environment_variables) > 0 ? ["created"] : []
    content {
      variables = var.environment_variables
    }
  }

  layers = var.layer_enabled ? [aws_lambda_layer_version.packages[0].arn] : []

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  tags = local.tags
}
