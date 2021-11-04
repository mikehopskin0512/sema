resource "aws_cloudwatch_log_group" "this" {
  name              = local.cw_log_group
  retention_in_days = var.cw_retention_in_days
  kms_key_id        = var.cw_kms_key
  tags              = local.cw_tags
}
