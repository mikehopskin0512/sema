resource "aws_lambda_layer_version" "packages" {
  s3_bucket  = local.packages_s3
  s3_key     = var.packages_s3_key
  layer_name = local.lambda_package_layer

  compatible_runtimes = [var.runtime]
}
