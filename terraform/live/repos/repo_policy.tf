resource "aws_ecr_lifecycle_policy" "this" {
  for_each   = toset(local.all_repos_name)
  repository = each.value

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep only 45 image, expire all others",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ${local.tag_prefix_list},
                "countType": "imageCountMoreThan",
                "countNumber": 45
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
