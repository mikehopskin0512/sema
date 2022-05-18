resource "aws_route53_record" "this" {
  for_each = local.ecs_external_access_enabled ? { "created" = "true" } : {}
  zone_id  = var.ecs_external_access.dns_zone_id
  name     = var.ecs_external_access.domain_prefix
  type     = "A"
  alias {
    name                   = var.ecs_external_access.lb_domain
    zone_id                = var.ecs_external_access.lb_zone_id
    evaluate_target_health = true
  }
}
