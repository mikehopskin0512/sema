# Module: vpc_peering

`vpc_peering` is a terraform module that creates and configures peering between two vpc.

<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |
| <a name="provider_aws.main"></a> [aws.main](#provider\_aws.main) | n/a |
| <a name="provider_aws.peer"></a> [aws.peer](#provider\_aws.peer) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_route.peer_vpc_route](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route) | resource |
| [aws_route.vpc_route](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route) | resource |
| [aws_vpc_peering_connection.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_peering_connection) | resource |
| [aws_region.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |
| [aws_route_tables.peer_vpc_rtb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route_tables) | data source |
| [aws_route_tables.vpc_rtb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route_tables) | data source |
| [aws_vpc.peer_vpc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |
| [aws_vpc.vpc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_auto_accept"></a> [auto\_accept](#input\_auto\_accept) | Accept the peering (both VPCs need to be in the same AWS account). | `bool` | `true` | no |
| <a name="input_common_extra_tags"></a> [common\_extra\_tags](#input\_common\_extra\_tags) | A key - value list of tags, that is attached to all resources. | `map(string)` | `{}` | no |
| <a name="input_main_region"></a> [main\_region](#input\_main\_region) | A region in which is placed peered vpc | `string` | `null` | no |
| <a name="input_name_prefix"></a> [name\_prefix](#input\_name\_prefix) | Name prefix for all resources. | `string` | n/a | yes |
| <a name="input_peer_name"></a> [peer\_name](#input\_peer\_name) | There is vpc peering name | `string` | `null` | no |
| <a name="input_peer_region"></a> [peer\_region](#input\_peer\_region) | A region in which is placed vpc for peering | `string` | `null` | no |
| <a name="input_peer_vpc_id"></a> [peer\_vpc\_id](#input\_peer\_vpc\_id) | A vpc id for peering | `string` | n/a | yes |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | The main vpc id | `string` | n/a | yes |
| <a name="input_vpc_peering_extra_tags"></a> [vpc\_peering\_extra\_tags](#input\_vpc\_peering\_extra\_tags) | A key - value list of tags, that is attached to the vpc peering connection. | `map(string)` | `{}` | no |

## Outputs

No outputs.

<!-- END_TF_DOCS -->