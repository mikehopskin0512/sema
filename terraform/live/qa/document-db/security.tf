resource "aws_security_group_rule" "vpn_subnet" {
  type = "ingress"
  protocol = "tcp"
  from_port = 27017
  to_port = 27017
  cidr_blocks = [ "10.1.3.0/24" ]
  security_group_id = module.qa_document_db.sg
}