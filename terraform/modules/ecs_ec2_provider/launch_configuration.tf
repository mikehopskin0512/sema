resource "aws_launch_configuration" "this" {
  associate_public_ip_address = var.launch_conf_associate_public_ip_address
  ebs_optimized               = var.launch_conf_ebs_optimized
  enable_monitoring           = var.launch_conf_enable_monitoring
  iam_instance_profile        = aws_iam_instance_profile.ec2.arn
  image_id                    = data.aws_ami.ecs_image.id
  instance_type               = var.instance_type
  key_name                    = local.key_name
  name_prefix                 = local.ec2_launch_configuration_name

  root_block_device {
    delete_on_termination = var.root_block_delete_on_termination
    encrypted             = var.root_block_encrypted
    iops                  = var.root_block_iops
    throughput            = var.root_block_throughput
    volume_size           = var.root_block_volume_size
    volume_type           = var.root_block_volume_type
  }

  security_groups  = [module.sg.id]
  user_data_base64 = base64encode(data.template_file.this.rendered)

  lifecycle {
    create_before_destroy = true
    ignore_changes        = [image_id]
  }
}
