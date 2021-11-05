resource "aws_ssm_parameter" "apollo_chrome_extension_id" {
  name  = "/${var.env}/apollo/chrome/extensionid"
  type  = "String"
  value = "nompfgddpldjighjfnkncgehjdbcphbf"
}
resource "aws_ssm_parameter" "apollo_mailchimp_registered_and_waitlist_users_audience_id" {
  name  = "/${var.env}/apollo/mailchimp/registeredandwaitlistusersaudienceid"
  type  = "String"
  value = "3b4eff2591"
}
resource "aws_ssm_parameter" "apollo_mailchimp_token" {
  name  = "/${var.env}/apollo/mailchimp/token"
  type  = "SecureString"
  value = "94eeb0c32194ee7a4cf7d3bb6a72192e-us6"
}
resource "aws_ssm_parameter" "apollo_mailchimp_server_prefix" {
  name  = "/${var.env}/apollo/mailchimp/serverprefix"
  type  = "String"
  value = "us6"
}
resource "aws_ssm_parameter" "apollo_user_voice_secret_key" {
  name  = "/${var.env}/apollo/uservoice/secretkey"
  type  = "SecureString"
  value = "cca14f748502199512520f2282fdde29"
}
resource "aws_ssm_parameter" "apollo_cors" {
  name  = "/${var.env}/apollo/cors"
  type  = "String"
  value = "https://app.semasoftware.com"
}
resource "aws_ssm_parameter" "apollo_mode_access-key" {
  name  = "/${var.env}/apollo/mode/access-key"
  type  = "String"
  value = "a3f7669a55c1c6b0caa8ffc1"
}
resource "aws_ssm_parameter" "apollo_mode_access-secret" {
  name  = "/${var.env}/apollo/mode/access-secret"
  type  = "SecureString"
  value = "bb80ef1a7195f7afaad94a31"
}
resource "aws_ssm_parameter" "apollo_mode_api-key" {
  name  = "/${var.env}/apollo/mode/api-key"
  type  = "String"
  value = "34b345c24570"
}
resource "aws_ssm_parameter" "apollo_mode_api-secret" {
  name  = "/${var.env}/apollo/mode/api-secret"
  type  = "SecureString"
  value = "b7457997376ab9720f3ed71f"
}
resource "aws_ssm_parameter" "apollo_mode_max-age" {
  name  = "/${var.env}/apollo/mode/max-age"
  type  = "String"
  value = "86400"
}
resource "aws_ssm_parameter" "apollo_mode_org" {
  name  = "/${var.env}/apollo/mode/org"
  type  = "String"
  value = "semasoftware"
}
resource "aws_ssm_parameter" "apollo_mode_report-id" {
  name  = "/${var.env}/apollo/mode/report-id"
  type  = "String"
  value = "458a98450313"
}
resource "aws_ssm_parameter" "apollo_mongo_cert-path" {
  name  = "/${var.env}/apollo/mongo/cert-path"
  type  = "String"
  value = "null"
}
resource "aws_ssm_parameter" "apollo_mongo_uri" {
  name  = "/${var.env}/apollo/mongo/uri"
  type  = "SecureString"
  value = "mongodb+srv://phoenix_admin:DnUKm3vsf3C3zaym@sema-cluster.tpplx.mongodb.net/phoenix_prod?authSource=admin&replicaSet=atlas-bjp57o-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
}
resource "aws_ssm_parameter" "apollo_org-domain" {
  name  = "/${var.env}/apollo/org-domain"
  type  = "String"
  value = "https://app.semasoftware.com"
}
resource "aws_ssm_parameter" "apollo_port" {
  name  = "/${var.env}/apollo/port"
  type  = "String"
  value = "3001"
}
resource "aws_ssm_parameter" "apollo_postgres_uri" {
  name  = "/${var.env}/apollo/postgres/uri"
  type  = "SecureString"
  value = "postgres://api_user:sfQ9FQpt2h1dahAw@172.31.30.159:5432/smp-qa"
}
resource "aws_ssm_parameter" "apollo_postgres_public-key" {
  name  = "/${var.env}/apollo/postgres/public-key"
  type  = "SecureString"
  value = "qwuwqx"
}
resource "aws_ssm_parameter" "apollo_sendgrid_api-key" {
  name  = "/${var.env}/apollo/sendgrid/api-key"
  type  = "String"
  value = "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"
}
resource "aws_ssm_parameter" "apollo_sendgrid_sender" {
  name  = "/${var.env}/apollo/sendgrid/sender"
  type  = "String"
  value = "info@semasoftware.io"
}
resource "aws_ssm_parameter" "apollo_token_life" {
  name  = "/${var.env}/apollo/token/life"
  type  = "String"
  value = "7776000"
}
resource "aws_ssm_parameter" "apollo_token_name" {
  name  = "/${var.env}/apollo/token/name"
  type  = "String"
  value = "_phoenix"
}
resource "aws_ssm_parameter" "apollo_token_secret" {
  name  = "/${var.env}/apollo/token/secret"
  type  = "SecureString"
  value = "ABCDEFG"
}
resource "aws_ssm_parameter" "apollo_version" {
  name  = "/${var.env}/apollo/version"
  type  = "String"
  value = "v1"
}

resource "aws_ssm_parameter" "node_env" {
  name  = "/${var.env}/apollo/node-env"
  type  = "String"
  value = "production"
}

resource "aws_ssm_parameter" "root_domain" {
  name  = "/${var.env}/apollo/root-domain"
  type  = "String"
  value = "semasoftware.com"
}

resource "aws_ssm_parameter" "allowed_origin" {
  name  = "/${var.env}/apollo/allowed-origin"
  type  = "String"
  value = "https://app.semasoftware.com"
}

resource "aws_ssm_parameter" "org_domain" {
  name  = "/${var.env}/apollo/org-domain"
  type  = "String"
  value = "https://app.semasoftware.com"
}

resource "aws_ssm_parameter" "aws_ccess-key" {
  name  = "/${var.env}/aws/access-key"
  type  = "String"
  value = "AKIARKPQIEYEVIDHBEVJ"
}
resource "aws_ssm_parameter" "aws_access-secret" {
  name  = "/${var.env}/aws/access-secret"
  type  = "SecureString"
  value = "zIIBZkHtU/MLdgPz+oBGq4orORE98x2qfWiXvsO2"
}
resource "aws_ssm_parameter" "aws_sns_topic_code-analysis" {
  name  = "/${var.env}/aws/sns/topic/code-analysis"
  type  = "String"
  value = "arn:aws:sns:us-east-1:091235034633:${var.env}-code-analysis-topic"
}
resource "aws_ssm_parameter" "aws_sns_topic_cross-region-replication" {
  name  = "/${var.env}/aws/sns/topic/cross-region-replication"
  type  = "String"
  value = "arn:aws:sns:us-east-1:091235034633:${var.env}-cross-region-replication"
}
resource "aws_ssm_parameter" "aws_sns_topic_filter_org-replication" {
  name  = "/${var.env}/aws/sns/topic/filter/org-replication"
  type  = "String"
  value = "arn:aws:sns:us-east-1:091235034633:${var.env}-cross-region-replication"
}
resource "aws_ssm_parameter" "github_app-id" {
  name  = "/${var.env}/github/app-id"
  type  = "String"
  value = "104624"
}
resource "aws_ssm_parameter" "github_client-id" {
  name  = "/${var.env}/github/client-id"
  type  = "String"
  value = "Iv1.1521fdd01686c281"
}
resource "aws_ssm_parameter" "github_client-secret" {
  name  = "/${var.env}/github/client-secret"
  type  = "SecureString"
  value = "9e2930f7115f993ebc40c1d78722ac3a8a90e6d3"
}
resource "aws_ssm_parameter" "github_private-key" {
  name  = "/${var.env}/github/private-key"
  type  = "SecureString"
  value = "wqd2qd"
}
resource "aws_ssm_parameter" "github_redirect" {
  name  = "/${var.env}/github/redirect"
  type  = "String"
  value = "https://api.semasoftware.com/v1/identities/github/cb"
}
resource "aws_ssm_parameter" "phoenix_api_endpoint" {
  name  = "/${var.env}/phoenix/api/endpoint"
  type  = "String"
  value = "https://api.semasoftware.com"
}
resource "aws_ssm_parameter" "phoenix_client_id" {
  name  = "/${var.env}/phoenix/client/id"
  type  = "String"
  value = "3f883860-862e-4a49-b149-f56371e87e88"

}
resource "aws_ssm_parameter" "phoenix_client_secret" {
  name  = "/${var.env}/phoenix/client/secret"
  type  = "String"
  value = "d7f3b825-bf97-4f21-babc-cf03a1babe91"
}

resource "aws_ssm_parameter" "apollo_intercom_token" {
  name  = "/${var.env}/apollo/intercom-token"
  type  = "String"
  value = "dG9rOmNlZGFlZmNiXzUzNjZfNDYxNF9iOWQzXzA1ODYzYWY2OTU5MzoxOjA="
}
