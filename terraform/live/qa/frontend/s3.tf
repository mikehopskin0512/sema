resource "aws_s3_bucket" "this" {
  bucket = local.s3_scr_avatars
  policy = data.aws_iam_policy_document.s3_scr_avatars.json
}

resource "aws_s3_bucket_acl" "this" {
  bucket = aws_s3_bucket.this.id
  acl    = "public-read"
}