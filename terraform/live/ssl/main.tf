module "semasoftware_cert" {
  source = "../../modules/cert-manager"
  domain = "semasoftware.com"
  enable_route53 = false
}
