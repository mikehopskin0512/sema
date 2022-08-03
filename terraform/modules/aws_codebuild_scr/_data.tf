data "template_file" "buildspec" {
  for_each = toset(local.projects)
  template = file("${path.module}/buildspec/buildspec.tftpl")
  vars = {
    env = "${var.name_prefix}"
    app = "${each.key}"
  }
}
