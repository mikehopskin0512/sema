resource "null_resource" "install_python_dependencies" {
  triggers = {
    file = "${sha1(file("${var.lambda_function_src}/requirements.txt"))}"
  }
  provisioner "local-exec" {
    command = "bash ${path.module}/helpers/install_dependencies.sh"

    environment = {
      function_name = local.lambda_function
      runtime       = var.runtime
      path_cwd      = var.lambda_function_src
    }
  }
}
