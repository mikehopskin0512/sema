output "pw" {
  value = module.prod_document_db.pw
  sensitive = true
}

output "sg" {
  value = module.prod_document_db.sg
}