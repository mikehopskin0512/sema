output "batch_policy_attachment" {
  value = aws_iam_role_policy_attachment.aws_batch_service_role
}

output "batch_service_role" {
  value = join("", aws_iam_role.aws_batch_service_role[*].arn)
}

output "ecs_instance_profile_role" {
  value = join("", aws_iam_instance_profile.ecs_instance_role[*].arn)
}

output "sfn_execution_role" {
  value = join("", aws_iam_role.sfn_execution_role[*].arn)
}
