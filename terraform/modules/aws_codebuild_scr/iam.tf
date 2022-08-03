resource "aws_iam_role" "this" {
  for_each = toset(local.projects)
  name     = "${var.name_prefix}-${each.key}-codebuild-role"

  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Principal" : {
            "Service" : "codebuild.amazonaws.com"
          },
          "Action" : "sts:AssumeRole"
        }
      ]
    }
  )
}

resource "aws_iam_role_policy" "this" {
  for_each = toset(local.projects)
  role     = aws_iam_role.this[each.key].name

  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Resource" : [
            "arn:aws:logs:us-east-1:091235034633:log-group:/aws/codebuild/${aws_codebuild_project.this[each.key].name}",
            "arn:aws:logs:us-east-1:091235034633:log-group:/aws/codebuild/${aws_codebuild_project.this[each.key].name}:*"
          ],
          "Action" : [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ]
        },
        {
          "Effect" : "Allow",
          "Resource" : [
            "arn:aws:s3:::codepipeline-us-east-1-*",
            "arn:aws:s3:::${var.name_prefix}-chrome-store",
            "arn:aws:s3:::${var.name_prefix}-chrome-store/*"
          ],
          "Action" : [
            "s3:PutObject",
            "s3:GetObject",
            "s3:GetObjectVersion",
            "s3:GetBucketAcl",
            "s3:GetBucketLocation"
          ]
        },
        {
          "Effect" : "Allow",
          "Action" : [
            "codebuild:CreateReportGroup",
            "codebuild:CreateReport",
            "codebuild:UpdateReport",
            "codebuild:BatchPutTestCases",
            "codebuild:BatchPutCodeCoverages",
            "codebuild:StopBuild"
          ],
          "Resource" : [
            "arn:aws:codebuild:us-east-1:091235034633:report-group/${aws_codebuild_project.this[each.key].name}-*"
          ]
        },
        {
          "Effect" : "Allow",
          "Action" : [
            "s3:GetObject",
            "s3:GetObjectVersion"
          ],
          "Resource" : [
            "arn:aws:s3:::${aws_s3_bucket.this.bucket}/${each.key}-sources.zip",
            "arn:aws:s3:::${aws_s3_bucket.this.bucket}/${each.key}-sources.zip/*"
          ]
        },
        {
          "Effect" : "Allow",
          "Resource" : [
            "arn:aws:s3:::${aws_s3_bucket.this.bucket}"
          ],
          "Action" : [
            "s3:ListBucket",
            "s3:GetBucketAcl",
            "s3:GetBucketLocation"
          ]
        },
        {
          "Effect" : "Allow",
          "Resource" : [
            "*"
          ],
          "Action" : [
            "ecr:GetAuthorizationToken",
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetDownloadUrlForLayer",
            "ecr:GetRepositoryPolicy",
            "ecr:DescribeRepositories",
            "ecr:ListImages",
            "ecr:DescribeImages",
            "ecr:BatchGetImage",
            "ecr:ListTagsForResource",
            "ecr:DescribeImageScanFindings",
            "ecr:InitiateLayerUpload",
            "ecr:UploadLayerPart",
            "ecr:CompleteLayerUpload",
            "ecr:PutImage"
          ]
        }
      ]
    }
  )
}
