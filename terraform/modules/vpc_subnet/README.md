# Module: vpc_subnet

`vpc_subnet` is a terraform module that creates and configures private or public subnets for a given VPC related to the applied parameters. According to the access type (public or private) it configures internet and NAT gateways and provides route tables.

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
| [aws_eip.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip) | resource |
| [aws_internet_gateway.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/internet_gateway) | resource |
| [aws_nat_gateway.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/nat_gateway) | resource |
| [aws_route.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route) | resource |
| [aws_route.public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route) | resource |
| [aws_route_table.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table) | resource |
| [aws_route_table_association.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table_association) | resource |
| [aws_subnet.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/subnet) | resource |
| [aws_availability_zones.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/availability_zones) | data source |
| [aws_vpc.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_availability_zones"></a> [availability\_zones](#input\_availability\_zones) | Override default az list. By default the module uses all availables azs in the current region. | `list(string)` | `[]` | no |
| <a name="input_cidr_suffix"></a> [cidr\_suffix](#input\_cidr\_suffix) | Suffix that is used in subnet CIDR masks. | `number` | n/a | yes |
| <a name="input_eip_tags"></a> [eip\_tags](#input\_eip\_tags) | A key - value list of additional tags, that is attached to elastic ip. | `map(string)` | `{}` | no |
| <a name="input_igw_tags"></a> [igw\_tags](#input\_igw\_tags) | A key - value list of additional tags, that is attached to internet gateway. | `map(string)` | `{}` | no |
| <a name="input_name_prefix"></a> [name\_prefix](#input\_name\_prefix) | Name prefix for all resources. | `string` | n/a | yes |
| <a name="input_nat_subnets"></a> [nat\_subnets](#input\_nat\_subnets) | A list of public subnet ids that are used by NAT. | `list(string)` | `[]` | no |
| <a name="input_nat_tags"></a> [nat\_tags](#input\_nat\_tags) | A key - value list of additional tags, that is attached to nat gateway. | `map(string)` | `{}` | no |
| <a name="input_rt_tags"></a> [rt\_tags](#input\_rt\_tags) | A key - value list of additional tags, that is attached to route tables. | `map(string)` | `{}` | no |
| <a name="input_subnet_tags"></a> [subnet\_tags](#input\_subnet\_tags) | A key - value list of additional tags, that is attached to subnets. | `map(string)` | `{}` | no |
| <a name="input_subnets"></a> [subnets](#input\_subnets) | Override default subnet count. By default subnet count = number of azs in the current region. | `number` | `0` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC id. | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_id"></a> [id](#output\_id) | VPC sunbets ids. |
| <a name="output_rt_id"></a> [rt\_id](#output\_rt\_id) | VPC route tables ids. |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
