resource "aws_codebuild_project" "this" {
  for_each      = toset(local.projects)
  name          = "${var.name_prefix}-scr-${each.key}-build"
  description   = "The project to build ${var.name_prefix}-${each.key} components"
  build_timeout = "60"

  service_role = aws_iam_role.this[each.key].arn

  dynamic "artifacts" {
    for_each = each.key == "themis" ? ["created"] : []
    content {
      location  = "${var.name_prefix}-chrome-store"
      type      = "S3"
      path      = "/"
      packaging = "NONE"
      name      = "/"
    }
  }

  dynamic "artifacts" {
    for_each = each.key != "themis" ? ["created"] : []
    content {
      type = "NO_ARTIFACTS"
    }
  }

  #   cache {
  #     type     = "S3"
  #     location = aws_s3_bucket.example.bucket
  #   }

  environment {
    compute_type    = "BUILD_GENERAL1_SMALL"
    image           = each.key == "themis" ? "cimg/node:15.14.0" : "aws/codebuild/standard:5.0"
    type            = "LINUX_CONTAINER"
    privileged_mode = true
  }

  logs_config {
    cloudwatch_logs {
      status = "ENABLED"
    }
  }

  source {
    type      = "S3"
    location  = "${aws_s3_bucket.this.bucket}/${each.key}-sources.zip"
    buildspec = data.template_file.buildspec[each.key].rendered
  }
}
