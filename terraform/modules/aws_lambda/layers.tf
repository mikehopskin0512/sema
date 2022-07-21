resource "aws_lambda_layer_version" "packages" {
  count      = var.layer_enabled ? 1 : 0
  s3_bucket  = local.packages_s3
  s3_key     = var.packages_s3_key
  layer_name = local.lambda_package_layer

  compatible_runtimes = [var.runtime]

  depends_on = [
    aws_s3_bucket.packages
  ]
}
