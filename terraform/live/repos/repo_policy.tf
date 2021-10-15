resource "aws_ecr_lifecycle_policy" "this" {
  for_each   = toset(local.all_repos_name)
  repository = each.value

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Expire images older than 30 days",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ${local.tag_prefix_list},
                "countUnit": "days",
                "countType": "sinceImagePushed",
                "countNumber": 30
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
