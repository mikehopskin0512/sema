locals {
  buckets_names = ["scr-avatars", "scr-infographics"]
}

module "s3_avatars" {
  source   = "../../../modules/phoenix_s3_buckets"
  for_each = toset(local.buckets_names)

  name_prefix = var.name_prefix
  bucket_name = each.key

  publisher_arns = [
    module.phoenix.execution_role_arn,
    module.apollo.execution_role_arn
  ]

}
