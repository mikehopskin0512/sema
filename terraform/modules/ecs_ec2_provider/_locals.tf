locals {
  ecs_autoscaling_group               = "${var.name_prefix}-ecs-autoscaling-group"
  ec2_profile_name                    = "${var.name_prefix}-ecs-ec2-instance-profile"
  ec2_iam_role_name                   = "${var.name_prefix}-ecs-ec2-instance-role"
  ec2_launch_configuration_name       = "${var.name_prefix}-ecs-ec2-lauch-configuration"
  key_pair_name                       = "${var.name_prefix}-ecs-key"
  ecs_ec2_sg_name                     = "${var.name_prefix}-ecs-instances"
  placement_group_name                = "${var.name_prefix}-ecs-placement-group"
  capacity_provider_name              = "${var.name_prefix}-ecs-capacity-provider"
  instance_ecs_policy_attachment_name = "${var.name_prefix}-ecs-policy-attachment"
}

locals {
  vpc_id   = data.aws_subnet.this.vpc_id
  key_name = var.ssh_access_enabled ? length(compact([null, "", var.aws_key_pair_id])) > 0 ? var.aws_key_pair_id : aws_key_pair.this[0].id : null
  autoscaling_tags_default = {
    "Name" = {
      "propagate_at_launch" : "true"
      "value" : "${var.ecs_cluster_name}-instance"
    },
    "AmazonECSManaged" = {
      "propagate_at_launch" : "true"
      "value" : ""
    }
  }
  autoscaling_tags = merge(
    var.autoscaling_tags,
    local.autoscaling_tags_default
  )
}
