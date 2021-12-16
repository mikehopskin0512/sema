resource "aws_s3_bucket" "packages" {
  bucket = local.packages_s3
  acl    = var.package_s3_acl

  tags = local.tags
}
