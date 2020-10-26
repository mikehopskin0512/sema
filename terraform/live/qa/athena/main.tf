module "athena" {
  source = "../../../modules/state-machine"

  batch_ssh_key         = "phoenix_qa"
  efs_access_point_name = "customer-repos"
  efs_host_path         = "/mnt/efs"
  env                   = "qa"
  eric_image            = "091235034633.dkr.ecr.us-east-1.amazonaws.com/athena-eric:latest"
  pipeline_name         = "athena"
  vpc_name              = "vpc-qa"
}
