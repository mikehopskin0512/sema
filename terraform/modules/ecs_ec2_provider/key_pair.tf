resource "tls_private_key" "this" {
  count     = var.ssh_access_enabled ? 1 : 0
  algorithm = "RSA"
}

resource "aws_key_pair" "this" {
  count      = var.ssh_access_enabled ? 1 : 0
  key_name   = local.key_pair_name
  public_key = tls_private_key.this[0].public_key_openssh
}
