variable "efs_file_system_id" {
  description = "Identifies the file system ID for the elastic file system to mount"
}

variable "efs_host_path" {
  description = "Path to mount efs on the host (ec2 instance)"
}

variable "env" {}

variable "template_name" {
  description = "Name of the launch template"
}
