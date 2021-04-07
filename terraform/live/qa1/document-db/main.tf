
module "qa1_document_db" {
  source = "../../../modules/document-db"
  
  env = "qa1"
  instance_class = "db.t3.medium"
  instance_count = 1
  name = "phoenix"
  vpc_name = "vpc-qa1"
}