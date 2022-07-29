module "codebuild" {
  source = "../../../modules/aws_codebuild_scr"

  name_prefix = var.name_prefix
}
