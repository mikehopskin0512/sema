output "job_definition" {
  value = aws_batch_job_definition.main.arn
}

output "job_queue" {
  value = aws_batch_job_queue.main.arn
}
