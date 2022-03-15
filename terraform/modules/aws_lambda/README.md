# Module: lambda

`lambda` is a terraform module that creates a VPC specific Lambda function.

## Dependencies

If you want to add necessary packages to your lambda, you have to install packages with a right directory structure [see here](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) and then create a zip archive and upload it to the bucket which that module will create with the name `${lambda_function_name}-packages`

Python example
    1. `pip install -r ./requirements.txt --target ./python`
    2. `zip -r lambda_layer_payload.zip python`
    3. `aws s3 cp lambda_layer_payload.zip s3://<${lambda_function_name}-packages>/lambda_layer_payload.zip`

# Module structure

<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_archive"></a> [archive](#provider\_archive) | n/a |
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_log_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_iam_role.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.cloudwatch](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.external](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.vpc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_lambda_function.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_layer_version.packages](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_layer_version) | resource |
| [aws_s3_bucket.packages](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_security_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [archive_file.function](https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file) | data source |
| [aws_caller_identity.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.cloudwatch](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.vpc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_cloudwatch_kms_key"></a> [cloudwatch\_kms\_key](#input\_cloudwatch\_kms\_key) | CloudWatch log group kms key id. | `string` | `null` | no |
| <a name="input_cloudwatch_tags"></a> [cloudwatch\_tags](#input\_cloudwatch\_tags) | A key - value list of tags, that is attached to the CloudWatch log group. | `map(string)` | `{}` | no |
| <a name="input_description"></a> [description](#input\_description) | The lambda function description. | `string` | `null` | no |
| <a name="input_environment_variables"></a> [environment\_variables](#input\_environment\_variables) | A map that defines environment variables for the Lambda function. | `map(string)` | `null` | no |
| <a name="input_external_iam_policies"></a> [external\_iam\_policies](#input\_external\_iam\_policies) | A list of external iam policies attached to Lambda function. | `list(string)` | `[]` | no |
| <a name="input_lambda_function_src"></a> [lambda\_function\_src](#input\_lambda\_function\_src) | Lambda function src file path. | `string` | n/a | yes |
| <a name="input_lambda_handler"></a> [lambda\_handler](#input\_lambda\_handler) | Lambda handler function path. | `string` | `"lambda_function.lambda_handler"` | no |
| <a name="input_memory_size"></a> [memory\_size](#input\_memory\_size) | Amount of memory in MB your Lambda Function can use at runtime. | `number` | `128` | no |
| <a name="input_name_prefix"></a> [name\_prefix](#input\_name\_prefix) | Name prefix for all resources. | `string` | n/a | yes |
| <a name="input_package_s3_acl"></a> [package\_s3\_acl](#input\_package\_s3\_acl) | The canned ACL to apply | `string` | `"private"` | no |
| <a name="input_packages_s3_key"></a> [packages\_s3\_key](#input\_packages\_s3\_key) | S3 key of an object containing the function's deployment package. | `string` | `"lambda_layer_payload.zip"` | no |
| <a name="input_publish"></a> [publish](#input\_publish) | Should a new lambda version be created? | `bool` | `false` | no |
| <a name="input_runtime"></a> [runtime](#input\_runtime) | The runtime used in the lambda function. | `string` | `"python3.8"` | no |
| <a name="input_sg_tags"></a> [sg\_tags](#input\_sg\_tags) | A key - value list of additional tags, that is attached to EC2 sg. | `map(string)` | `{}` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | List of subnet IDs where Lambda will be hosted. | `list(string)` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | A key - value list of tags, that is attached to the distribution. | `map(string)` | `{}` | no |
| <a name="input_timeout"></a> [timeout](#input\_timeout) | The amount of time your Lambda Function has to run in seconds. | `number` | `3` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID to attach to. | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_arn"></a> [arn](#output\_arn) | Lambda function ARN. |
| <a name="output_name"></a> [name](#output\_name) | Lambda function name. |
<!-- END_TF_DOCS -->
