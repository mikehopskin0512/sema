resource "aws_cloudwatch_log_group" "this" {
  name       = local.cloudwatch_log_group
  kms_key_id = var.cloudwatch_kms_key
  tags       = local.cloudwatch_log_group_tags
}
