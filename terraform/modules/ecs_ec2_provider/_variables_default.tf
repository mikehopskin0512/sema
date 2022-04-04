variable "capacity_rebalance" {
  type        = bool
  description = "Indicates whether capacity rebalance is enabled."
  default     = false
}

variable "default_cooldown" {
  type        = number
  description = "The amount of time, in seconds, after a scaling activity completes before another scaling activity can start."
  default     = 300
}

variable "desired_capacity" {
  type        = number
  description = "The number of Amazon EC2 instances that should be running in the group."
  default     = 1
}

variable "force_delete" {
  type        = bool
  description = "Allows deleting the Auto Scaling Group without waiting for all instances in the pool to terminate."
  default     = true
}

variable "health_check_grace_period" {
  type        = number
  description = "Time after instance comes into service before checking health."
  default     = 0
}

variable "health_check_type" {
  type        = string
  description = "EC2 or ELB. Controls how health checking is done."
  default     = "EC2"
}

variable "max_instance_lifetime" {
  type        = number
  description = "The maximum amount of time, in seconds, that an instance can be in service, values must be either equal to 0 or between 86400 and 31536000 seconds."
  default     = 0
}

variable "max_size" {
  type        = number
  description = "The maximum size of the Auto Scaling Group."
  default     = 1
}

variable "min_size" {
  type        = number
  description = "Specifies the minimum number of instances to maintain in the warm pool."
  default     = 1
}

variable "protect_from_scale_in" {
  type        = bool
  description = "Allows setting instance protection."
  default     = false
}

variable "metrics_granularity" {
  type        = string
  description = "The granularity to associate with the metrics to collect."
  default     = "1Minute"
}

variable "launch_conf_associate_public_ip_address" {
  type        = bool
  description = "Associate a public ip address with an instance in a VPC."
  default     = false
}

variable "launch_conf_ebs_optimized" {
  type        = bool
  description = "If true, the launched EC2 instance will be EBS-optimized."
  default     = false
}

variable "launch_conf_enable_monitoring" {
  type        = bool
  description = "Enables/disables detailed monitoring."
  default     = true
}

variable "instance_type" {
  type        = string
  description = "The size of instance to launch."
  default     = "t3.nano"
}

variable "ssh_access_enabled" {
  type        = bool
  description = "Enables ssh access in the launch configuration"
  default     = false
}

variable "aws_key_pair_id" {
  type        = string
  description = "An id of key pair AWS resource"
  default     = null
}

variable "managed_termination_protection" {
  type        = string
  description = "Enables or disables container-aware termination of instances in the auto scaling group when scale-in happens."
  default     = "DISABLED"
}

variable "managed_scaling" {
  type        = string
  description = "Whether auto scaling is managed by ECS."
  default     = "ENABLED"
}

variable "autoscaling_tags" {
  type = map(object({
    propagate_at_launch : string
    value : string
  }))
  description = "value"
  default = {
    "Description" = {
      "propagate_at_launch" : "true"
      "value" : "This instance is the part of the Auto Scaling group which was created through ECS Console"
    }
  }
}

variable "ecs_ec2_sg_description" {
  type        = string
  description = "Description for security group."
  default     = "Security group for ecs ec2 instances"
}

variable "placement_group_strategy" {
  type        = string
  description = "The placement strategy. Can be cluster, partition or spread."
  default     = "cluster"
}

variable "root_block_delete_on_termination" {
  type        = bool
  description = "Whether the volume should be destroyed on instance termination"
  default     = true
}

variable "root_block_encrypted" {
  type        = bool
  description = "Whether the volume should be encrypted or not."
  default     = false
}

variable "root_block_iops" {
  type        = number
  description = "The amount of provisioned IOPS. This must be set with a volume_type of io1."
  default     = 0
}

variable "root_block_throughput" {
  type        = number
  description = "The throughput (MiBps) to provision for a gp3 volume."
  default     = 0
}

variable "root_block_volume_size" {
  type        = number
  description = "The size of the volume in gigabytes."
  default     = 30
}

variable "root_block_volume_type" {
  type        = string
  description = "The type of volume."
  default     = "gp2"
}
