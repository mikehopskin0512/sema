# Creates/manages KMS CMK
resource "aws_kms_key" "main" {
  description              = var.description
  customer_master_key_spec = var.key_spec
  is_enabled               = var.enabled
  enable_key_rotation      = var.rotation_enabled
  policy                   = data.aws_iam_policy_document.kms.json
  deletion_window_in_days  = 30

  tags = {
    Name      = "${var.env}-${var.alias}"
    Env       = var.env
    Terraform = true
  }
}

# Add an alias to the key
resource "aws_kms_alias" "main" {
  name          = "alias/${var.env}-${var.alias}"
  target_key_id = aws_kms_key.main.key_id
}
