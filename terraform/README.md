# Terraform

Sema infrastructure-as-code, using Terraform.

## Directory structure

This folder is laid out with `/live` being the repository for currently used terraform codes, which use `/modules` for reusable components of each service.

## Getting set up with terraform

1. [Install](https://learn.hashicorp.com/tutorials/terraform/install-cli) the specific terraform version specified in `.terraform-version`
2. Assure you have the proper AWS profile setup and configured in `~/.aws/credentials` (e.g. `sema-terraform`)
3. Navigate to the environment you wish to set up (e.g. `live/qa`)
4. Run `terraform init` in each directory in the environment to download required plugins.

## Running Terraform commands

For a given service (e.g. `live/qa/frontend`), run:

```bash
terraform plan
```

in order to see a preview of the execution plan and see the scheduled actions to be performed, then run:

```bash
terraform apply
```

to execute the plan.
