
module "qa_document_db" {
  source = "../../../modules/document-db"
  
  env = "qa"
  instance_class = "db.t3.medium"
  instance_count = 1
  name = "phoenix"
  vpc_name = "vpc-qa"
}