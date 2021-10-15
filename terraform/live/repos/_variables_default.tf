variable "tag_prefix_list" {
  type        = list(string)
  description = "A list of tag prefix for expire"
  default     = ["qa-"]
}
