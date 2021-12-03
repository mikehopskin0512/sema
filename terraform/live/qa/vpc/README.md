# Module: frontend

`vpc` is the module for creating vpc, subnets and necessary peering connections.

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 3.38.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 3.38.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_scqp_peering"></a> [scqp\_peering](#module\_scqp\_peering) | ../../../modules/vpc_peering | n/a |
| <a name="module_vpc_subnet_private"></a> [vpc\_subnet\_private](#module\_vpc\_subnet\_private) | ../../../modules/vpc_subnet | n/a |
| <a name="module_vpc_subnet_public"></a> [vpc\_subnet\_public](#module\_vpc\_subnet\_public) | ../../../modules/vpc_subnet | n/a |
| <a name="module_vpn_endpoint_peering"></a> [vpn\_endpoint\_peering](#module\_vpn\_endpoint\_peering) | ../../../modules/vpc_peering | n/a |
| <a name="module_vpn_peering"></a> [vpn\_peering](#module\_vpn\_peering) | ../../../modules/vpc_peering | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_vpc.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_profile"></a> [aws\_profile](#input\_aws\_profile) | A name of aws profile for provider | `string` | `"sema-terraform"` | no |
| <a name="input_common_tags"></a> [common\_tags](#input\_common\_tags) | A key - value list of common tags, that is attached to the all resources | `map(string)` | <pre>{<br>  "environment": "qa",<br>  "organization": "sema",<br>  "project": "phoenix",<br>  "terraform": "true"<br>}</pre> | no |
| <a name="input_name_prefix"></a> [name\_prefix](#input\_name\_prefix) | Name prefix for all resources. | `string` | `"qa"` | no |
| <a name="input_vpc_cidr"></a> [vpc\_cidr](#input\_vpc\_cidr) | VPC IP CIDR map. | `string` | `"10.50.0.0/16"` | no |
| <a name="input_vpc_enable_dns_hostnames"></a> [vpc\_enable\_dns\_hostnames](#input\_vpc\_enable\_dns\_hostnames) | Should DNS hostnames support be enabled for VPC? | `bool` | `true` | no |
| <a name="input_vpc_enable_dns_support"></a> [vpc\_enable\_dns\_support](#input\_vpc\_enable\_dns\_support) | Should DNS support be enabled for VPC? | `bool` | `true` | no |
| <a name="input_vpc_subnet_private_suffix"></a> [vpc\_subnet\_private\_suffix](#input\_vpc\_subnet\_private\_suffix) | Suffix that is used in private subnet CIDR masks. | `number` | `0` | no |
| <a name="input_vpc_subnet_public_suffix"></a> [vpc\_subnet\_public\_suffix](#input\_vpc\_subnet\_public\_suffix) | Suffix that is used in public subnet CIDR masks. | `number` | `100` | no |
| <a name="input_vpc_tags"></a> [vpc\_tags](#input\_vpc\_tags) | A key - value list of additional tags, that is attached to VPC. | `map(string)` | `{}` | no |

## Outputs

No outputs.
<!-- END_TF_DOCS -->