# Module: ec2_provider

`ec2_provider` is a terraform module that creates and configures resources needed for EC2 capacity provider of AWS ECS.

# Module structure

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |
| <a name="provider_template"></a> [template](#provider\_template) | n/a |
| <a name="provider_tls"></a> [tls](#provider\_tls) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_sg"></a> [sg](#module\_sg) | ../../../sg | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_autoscaling_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/autoscaling_group) | resource |
| [aws_ecs_capacity_provider.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_capacity_provider) | resource |
| [aws_iam_instance_profile.ec2](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_instance_profile) | resource |
| [aws_iam_policy_attachment.default_instance_ecs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy_attachment) | resource |
| [aws_iam_role.ec2](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_key_pair.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/key_pair) | resource |
| [aws_launch_configuration.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/launch_configuration) | resource |
| [tls_private_key.this](https://registry.terraform.io/providers/hashicorp/tls/latest/docs/resources/private_key) | resource |
| [aws_ami.ecs_image](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami) | data source |
| [aws_iam_policy.instance](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy) | data source |
| [aws_subnet.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/subnet) | data source |
| [template_file.this](https://registry.terraform.io/providers/hashicorp/template/latest/docs/data-sources/file) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_autoscaling_tags"></a> [autoscaling\_tags](#input\_autoscaling\_tags) | value | <pre>map(object({<br>    propagate_at_launch : string<br>    value : string<br>  }))</pre> | <pre>{<br>  "Description": {<br>    "propagate_at_launch": "true",<br>    "value": "This instance is the part of the Auto Scaling group which was created through ECS Console"<br>  }<br>}</pre> | no |
| <a name="input_aws_key_pair_id"></a> [aws\_key\_pair\_id](#input\_aws\_key\_pair\_id) | An id of key pair AWS resource | `string` | `null` | no |
| <a name="input_capacity_rebalance"></a> [capacity\_rebalance](#input\_capacity\_rebalance) | Indicates whether capacity rebalance is enabled. | `bool` | `false` | no |
| <a name="input_default_cooldown"></a> [default\_cooldown](#input\_default\_cooldown) | The amount of time, in seconds, after a scaling activity completes before another scaling activity can start. | `number` | `300` | no |
| <a name="input_desired_capacity"></a> [desired\_capacity](#input\_desired\_capacity) | The number of Amazon EC2 instances that should be running in the group. | `number` | `1` | no |
| <a name="input_ecs_cluster_name"></a> [ecs\_cluster\_name](#input\_ecs\_cluster\_name) | ECS cluster name. | `string` | n/a | yes |
| <a name="input_ecs_ec2_sg_description"></a> [ecs\_ec2\_sg\_description](#input\_ecs\_ec2\_sg\_description) | Description for security group. | `string` | `"Security group for ecs ec2 instances"` | no |
| <a name="input_force_delete"></a> [force\_delete](#input\_force\_delete) | Allows deleting the Auto Scaling Group without waiting for all instances in the pool to terminate. | `bool` | `true` | no |
| <a name="input_health_check_grace_period"></a> [health\_check\_grace\_period](#input\_health\_check\_grace\_period) | Time after instance comes into service before checking health. | `number` | `0` | no |
| <a name="input_health_check_type"></a> [health\_check\_type](#input\_health\_check\_type) | EC2 or ELB. Controls how health checking is done. | `string` | `"EC2"` | no |
| <a name="input_instance_type"></a> [instance\_type](#input\_instance\_type) | The size of instance to launch. | `string` | `"t3.nano"` | no |
| <a name="input_launch_conf_associate_public_ip_address"></a> [launch\_conf\_associate\_public\_ip\_address](#input\_launch\_conf\_associate\_public\_ip\_address) | Associate a public ip address with an instance in a VPC. | `bool` | `false` | no |
| <a name="input_launch_conf_ebs_optimized"></a> [launch\_conf\_ebs\_optimized](#input\_launch\_conf\_ebs\_optimized) | If true, the launched EC2 instance will be EBS-optimized. | `bool` | `false` | no |
| <a name="input_launch_conf_enable_monitoring"></a> [launch\_conf\_enable\_monitoring](#input\_launch\_conf\_enable\_monitoring) | Enables/disables detailed monitoring. | `bool` | `true` | no |
| <a name="input_managed_scaling"></a> [managed\_scaling](#input\_managed\_scaling) | Whether auto scaling is managed by ECS. | `string` | `"ENABLED"` | no |
| <a name="input_managed_termination_protection"></a> [managed\_termination\_protection](#input\_managed\_termination\_protection) | Enables or disables container-aware termination of instances in the auto scaling group when scale-in happens. | `string` | `"DISABLED"` | no |
| <a name="input_max_instance_lifetime"></a> [max\_instance\_lifetime](#input\_max\_instance\_lifetime) | The maximum amount of time, in seconds, that an instance can be in service, values must be either equal to 0 or between 86400 and 31536000 seconds. | `number` | `0` | no |
| <a name="input_max_size"></a> [max\_size](#input\_max\_size) | The maximum size of the Auto Scaling Group. | `number` | `1` | no |
| <a name="input_metrics_granularity"></a> [metrics\_granularity](#input\_metrics\_granularity) | The granularity to associate with the metrics to collect. | `string` | `"1Minute"` | no |
| <a name="input_min_size"></a> [min\_size](#input\_min\_size) | Specifies the minimum number of instances to maintain in the warm pool. | `number` | `1` | no |
| <a name="input_name_prefix"></a> [name\_prefix](#input\_name\_prefix) | Name prefix for all resources. | `string` | n/a | yes |
| <a name="input_placement_group_strategy"></a> [placement\_group\_strategy](#input\_placement\_group\_strategy) | The placement strategy. Can be cluster, partition or spread. | `string` | `"cluster"` | no |
| <a name="input_protect_from_scale_in"></a> [protect\_from\_scale\_in](#input\_protect\_from\_scale\_in) | Allows setting instance protection. | `bool` | `false` | no |
| <a name="input_root_block_delete_on_termination"></a> [root\_block\_delete\_on\_termination](#input\_root\_block\_delete\_on\_termination) | Whether the volume should be destroyed on instance termination | `bool` | `true` | no |
| <a name="input_root_block_encrypted"></a> [root\_block\_encrypted](#input\_root\_block\_encrypted) | Whether the volume should be encrypted or not. | `bool` | `false` | no |
| <a name="input_root_block_iops"></a> [root\_block\_iops](#input\_root\_block\_iops) | The amount of provisioned IOPS. This must be set with a volume\_type of io1. | `number` | `0` | no |
| <a name="input_root_block_throughput"></a> [root\_block\_throughput](#input\_root\_block\_throughput) | The throughput (MiBps) to provision for a gp3 volume. | `number` | `0` | no |
| <a name="input_root_block_volume_size"></a> [root\_block\_volume\_size](#input\_root\_block\_volume\_size) | The size of the volume in gigabytes. | `number` | `30` | no |
| <a name="input_root_block_volume_type"></a> [root\_block\_volume\_type](#input\_root\_block\_volume\_type) | The type of volume. | `string` | `"gp2"` | no |
| <a name="input_ssh_access_enabled"></a> [ssh\_access\_enabled](#input\_ssh\_access\_enabled) | Enables ssh access in the launch configuration | `bool` | `false` | no |
| <a name="input_vpc_subnet_ids"></a> [vpc\_subnet\_ids](#input\_vpc\_subnet\_ids) | ID of the private subnet where to create ssm instance. | `list(string)` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_auto_scaling_group_arn"></a> [auto\_scaling\_group\_arn](#output\_auto\_scaling\_group\_arn) | n/a |
| <a name="output_capacity_provider"></a> [capacity\_provider](#output\_capacity\_provider) | n/a |
| <a name="output_iam_role_name"></a> [iam\_role\_name](#output\_iam\_role\_name) | n/a |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
