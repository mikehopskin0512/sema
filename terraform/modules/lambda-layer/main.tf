# ---------------------------------------------------------------------------------------------------------------------
# LAYER ARCHIVE
# ---------------------------------------------------------------------------------------------------------------------

data "archive_file" "layer_zip" {
  source_dir  = "${path.module}/layers/${var.layer_name}"
  type        = "zip"
  output_path = "${path.module}/layers/dist/${var.env}-${var.layer_name}.zip"
}

# ---------------------------------------------------------------------------------------------------------------------
# LAMBDA LAYER
# ---------------------------------------------------------------------------------------------------------------------
resource "aws_lambda_layer_version" "lambda_layer" {
  filename   = "${path.module}/layers/dist/${var.env}-${var.layer_name}.zip"
  layer_name = "${var.env}-${var.layer_name}"
  source_code_hash = data.archive_file.layer_zip.output_base64sha256

  compatible_runtimes = ["nodejs12.x"]
}