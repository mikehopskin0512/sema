# Module: lambda

`lambda` is a terraform module that creates a Lambda function for the apollo which will restore the new backup when invoked.

# Module structure

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | ../../../../common/lambda | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_cloudfront_distribution.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/cloudfront_distribution) | data source |
| [aws_iam_policy_document.cloudfront](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.code_pipeline](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_cloudfront_distribution_id"></a> [cloudfront\_distribution\_id](#input\_cloudfront\_distribution\_id) | CloudFront distribution id. | `string` | n/a | yes |
| <a name="input_cloudwatch_kms_key"></a> [cloudwatch\_kms\_key](#input\_cloudwatch\_kms\_key) | CloudWatch log group kms key id. | `string` | `null` | no |
| <a name="input_description"></a> [description](#input\_description) | The lambda function description. | `string` | `null` | no |
| <a name="input_environment_variables"></a> [environment\_variables](#input\_environment\_variables) | A map that defines environment variables for the Lambda function. | `map(string)` | `null` | no |
| <a name="input_external_iam_policies"></a> [external\_iam\_policies](#input\_external\_iam\_policies) | A list of external iam policies attached to Lambda function. | `list(string)` | `[]` | no |
| <a name="input_memory_size"></a> [memory\_size](#input\_memory\_size) | Amount of memory in MB your Lambda Function can use at runtime. | `number` | `128` | no |
| <a name="input_name_prefix"></a> [name\_prefix](#input\_name\_prefix) | Name prefix for all resources. | `string` | n/a | yes |
| <a name="input_publish"></a> [publish](#input\_publish) | Should a new lambda version be created? | `bool` | `false` | no |
| <a name="input_runtime"></a> [runtime](#input\_runtime) | The runtime used in the lambda function. | `string` | `"python3.8"` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | List of subnet IDs where Lambda will be hosted. | `list(string)` | n/a | yes |
| <a name="input_timeout"></a> [timeout](#input\_timeout) | The amount of time your Lambda Function has to run in seconds. | `number` | `3` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID to attach to. | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_arn"></a> [arn](#output\_arn) | Lambda function ARN. |
| <a name="output_name"></a> [name](#output\_name) | Lambda function name. |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
