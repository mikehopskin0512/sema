# Module: sg

`sg` is a simple terraform module that creates and configures AWS Security group.

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
| [aws_security_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.egress_cidr_rules](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.egress_ipv6_cidr_rules](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.egress_security_group_rules](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.egress_self_rules](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_cidr_rules](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_ipv6_cidr_rules](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_security_group_rules](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_self_rules](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_egress_cidr_rules"></a> [egress\_cidr\_rules](#input\_egress\_cidr\_rules) | A list of objects, that describe egress cidr blocks. | <pre>list(object({<br>    protocol  = string<br>    from_port = number<br>    to_port   = number<br>    entries   = list(string)<br>  }))</pre> | `[]` | no |
| <a name="input_egress_ipv6_cidr_rules"></a> [egress\_ipv6\_cidr\_rules](#input\_egress\_ipv6\_cidr\_rules) | A list of objects, that describe egress ipv6 cidr blocks. | <pre>list(object({<br>    protocol  = string<br>    from_port = number<br>    to_port   = number<br>    entries   = list(string)<br>  }))</pre> | `[]` | no |
| <a name="input_egress_security_group_rules"></a> [egress\_security\_group\_rules](#input\_egress\_security\_group\_rules) | A list of objects, that describe egress security groups rules. | <pre>list(object({<br>    protocol  = string<br>    from_port = number<br>    to_port   = number<br>    entries   = string<br>  }))</pre> | `[]` | no |
| <a name="input_egress_self_rules"></a> [egress\_self\_rules](#input\_egress\_self\_rules) | A list of objects, that describe egress self rules. | <pre>list(object({<br>    protocol  = string<br>    from_port = number<br>    to_port   = number<br>  }))</pre> | `[]` | no |
| <a name="input_ingress_cidr_rules"></a> [ingress\_cidr\_rules](#input\_ingress\_cidr\_rules) | A list of objects, that describe ingress cidr blocks. | <pre>list(object({<br>    protocol  = string<br>    from_port = number<br>    to_port   = number<br>    entries   = list(string)<br>  }))</pre> | `[]` | no |
| <a name="input_ingress_ipv6_cidr_rules"></a> [ingress\_ipv6\_cidr\_rules](#input\_ingress\_ipv6\_cidr\_rules) | A list of objects, that describe ingress ipv6 cidr blocks. | <pre>list(object({<br>    protocol  = string<br>    from_port = number<br>    to_port   = number<br>    entries   = list(string)<br>  }))</pre> | `[]` | no |
| <a name="input_ingress_security_group_rules"></a> [ingress\_security\_group\_rules](#input\_ingress\_security\_group\_rules) | A list of objects, that describe ingress security groups rules. | <pre>list(object({<br>    protocol  = string<br>    from_port = number<br>    to_port   = number<br>    entries   = string<br>  }))</pre> | `[]` | no |
| <a name="input_ingress_self_rules"></a> [ingress\_self\_rules](#input\_ingress\_self\_rules) | A list of objects, that describe ingress self rules. | <pre>list(object({<br>    protocol  = string<br>    from_port = number<br>    to_port   = number<br>  }))</pre> | `[]` | no |
| <a name="input_name_prefix"></a> [name\_prefix](#input\_name\_prefix) | Name prefix for security group. | `string` | n/a | yes |
| <a name="input_security_group_description"></a> [security\_group\_description](#input\_security\_group\_description) | Description for security group | `string` | `"Security group from sg module"` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | A key - value list of tags, that is attached to all resources. | `map(string)` | `{}` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID to attach to. | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_id"></a> [id](#output\_id) | Security group id. |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
