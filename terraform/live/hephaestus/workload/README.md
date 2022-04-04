# Module: frontend

`frontend` is module for creating two ecs task with apollo(backend) and phoenix(frontend). Also module will create a ecs cluster.

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 3.38.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 3.38.0 |
| <a name="provider_terraform"></a> [terraform](#provider\_terraform) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_alb"></a> [alb](#module\_alb) | ../../../modules/load-balancer | n/a |
| <a name="module_apollo"></a> [apollo](#module\_apollo) | ../../../modules/ecs_task | n/a |
| <a name="module_phoenix"></a> [phoenix](#module\_phoenix) | ../../../modules/ecs_task | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_ecs_cluster.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster) | resource |
| [aws_secretsmanager_secret.apollo](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret.phoenix](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret_version.apollo](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.phoenix](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [aws_secretsmanager_secret_version.apollo](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret_version) | data source |
| [aws_secretsmanager_secret_version.phoenix](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret_version) | data source |
| [aws_subnet_ids.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/subnet_ids) | data source |
| [aws_subnet_ids.public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/subnet_ids) | data source |
| [aws_vpc.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |
| [terraform_remote_state.repos](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/data-sources/remote_state) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_apollo_image"></a> [apollo\_image](#input\_apollo\_image) | docker image to be used for apollo/api; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/apollo:prod | `string` | n/a | yes |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | The AWS region things are created in | `string` | `"us-east-1"` | no |
| <a name="input_ecs_task_definition_resources"></a> [ecs\_task\_definition\_resources](#input\_ecs\_task\_definition\_resources) | CPU and RAM limits for the task definition. | <pre>object({<br>    cpu    = number<br>    memory = number<br>  })</pre> | <pre>{<br>  "cpu": 1024,<br>  "memory": 2048<br>}</pre> | no |
| <a name="input_name_prefix"></a> [name\_prefix](#input\_name\_prefix) | Name prefix for all resources. | `string` | `"qa"` | no |
| <a name="input_phoenix_image"></a> [phoenix\_image](#input\_phoenix\_image) | docker image to be used for phoenix/web; eg. 091235034633.dkr.ecr.us-east-1.amazonaws.com/phoenix:prod | `string` | n/a | yes |
| <a name="input_vpc_name"></a> [vpc\_name](#input\_vpc\_name) | The vpc name for other resources | `string` | `"vpc-qa"` | no |

## Outputs

No outputs.
<!-- END_TF_DOCS -->