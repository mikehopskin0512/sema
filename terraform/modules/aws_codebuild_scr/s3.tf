resource "aws_s3_bucket" "this" {
  bucket = "${var.name_prefix}-scr-codebuild-sources"

  versioning {
    enabled = true
  }
}
