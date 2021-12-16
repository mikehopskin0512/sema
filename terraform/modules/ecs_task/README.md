# Module: ecs

`ecs` is a terraform module that creates an ECS task and service and configures additional resources for it.

## Datadog

You can enable datadog forwarder logs through setting variable `datadog api_key` and that's all that you need.

# Module structure

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_log_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_ecs_service.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service) | resource |
| [aws_ecs_task_definition.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_iam_role.execution](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.task](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.cw](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.ecr](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.external](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_security_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_caller_identity.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.cw](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecr](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_application"></a> [application](#input\_application) | Task definition container name. | `string` | n/a | yes |
| <a name="input_cw_kms_key"></a> [cw\_kms\_key](#input\_cw\_kms\_key) | The ARN of the KMS Key to use when encrypting log data. | `string` | `null` | no |
| <a name="input_cw_retention_in_days"></a> [cw\_retention\_in\_days](#input\_cw\_retention\_in\_days) | Number of days is needed to retain log events in the log group. | `number` | `0` | no |
| <a name="input_cw_tags"></a> [cw\_tags](#input\_cw\_tags) | A key - value list of additional tags, that is attached to a cloudwatch log group. | `map(string)` | `{}` | no |
| <a name="input_ecr_image"></a> [ecr\_image](#input\_ecr\_image) | ECR image tag. | `string` | `"latest"` | no |
| <a name="input_ecr_repo"></a> [ecr\_repo](#input\_ecr\_repo) | ECS task ecr repository info. | <pre>object({<br>    url     = string<br>    arn     = string<br>    kms_key = string<br>  })</pre> | n/a | yes |
| <a name="input_ecs_cluster"></a> [ecs\_cluster](#input\_ecs\_cluster) | ECS cluster ARN where services are located. | `string` | n/a | yes |
| <a name="input_ecs_command"></a> [ecs\_command](#input\_ecs\_command) | Redirect ECS container's command. | `list(string)` | `[]` | no |
| <a name="input_ecs_envs"></a> [ecs\_envs](#input\_ecs\_envs) | A list of env variables is set to ECS task. | <pre>list(<br>    object({<br>      name  = string<br>      value = string<br>    })<br>  )</pre> | `[]` | no |
| <a name="input_ecs_external_access"></a> [ecs\_external\_access](#input\_ecs\_external\_access) | Configuration parameters for allowing external access. | <pre>object({<br>    target_group_arn = string<br>    port             = number<br>    allowed_sg       = list(string)<br>  })</pre> | `null` | no |
| <a name="input_ecs_secrets"></a> [ecs\_secrets](#input\_ecs\_secrets) | A list of secrets attached to ECS task. | <pre>list(<br>    object({<br>      envs      = list(string)<br>      valueFrom = string<br>      kms       = string<br>    })<br>  )</pre> | `[]` | no |
| <a name="input_external_iam_policies"></a> [external\_iam\_policies](#input\_external\_iam\_policies) | A list of external iam policies attached to Lambda function. | `list(string)` | `[]` | no |
| <a name="input_name_prefix"></a> [name\_prefix](#input\_name\_prefix) | Name prefix for all resources. | `string` | n/a | yes |
| <a name="input_requires_compatibilities_ec2_enabled"></a> [requires\_compatibilities\_ec2\_enabled](#input\_requires\_compatibilities\_ec2\_enabled) | Enables ec2 compatibilities for ecs task defenition | `bool` | `false` | no |
| <a name="input_service_tags"></a> [service\_tags](#input\_service\_tags) | A key - value list of additional tags, that is attached to a service. | `map(string)` | `{}` | no |
| <a name="input_sg_tags"></a> [sg\_tags](#input\_sg\_tags) | A key - value list of additional tags, that is attached to security group. | `map(string)` | `{}` | no |
| <a name="input_subnets"></a> [subnets](#input\_subnets) | List of subnets where ecs task apps are running. | `list(string)` | n/a | yes |
| <a name="input_task_count"></a> [task\_count](#input\_task\_count) | Number of tasks running simultaneously. | `number` | `1` | no |
| <a name="input_task_definition_resources"></a> [task\_definition\_resources](#input\_task\_definition\_resources) | CPU and RAM limits for the task definition. | <pre>object({<br>    cpu    = number<br>    memory = number<br>  })</pre> | <pre>{<br>  "cpu": 512,<br>  "memory": 1024<br>}</pre> | no |
| <a name="input_task_definition_tags"></a> [task\_definition\_tags](#input\_task\_definition\_tags) | A key - value list of additional tags, that is attached to a task definition. | `map(string)` | `{}` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC where ecs task apps are running. | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_name"></a> [name](#output\_name) | ECS service name. |
| <a name="output_sg"></a> [sg](#output\_sg) | ECS service security group id. |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
