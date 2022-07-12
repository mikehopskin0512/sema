resource "aws_s3_bucket" "this" {
  bucket = local.s3_name
  policy = data.aws_iam_policy_document.s3.json

  lifecycle {
    ignore_changes = [
      cors_rule
    ]
  }
}

resource "aws_s3_bucket_acl" "this" {
  bucket = aws_s3_bucket.this.id
  acl    = "public-read"
}

resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.bucket

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}
