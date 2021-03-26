
module "prod_document_db" {
  source = "../../../modules/document-db"
  
  env = "prod"
  instance_class = "db.t3.medium"
  instance_count = 1
  name = "phoenix"
  vpc_name = "vpc-prod"
}
