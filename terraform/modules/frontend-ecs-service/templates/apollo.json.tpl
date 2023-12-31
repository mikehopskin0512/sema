[
  {
    "name": "${container_name}",
    "image": "${image}",
    "cpu": ${container_cpu},
    "memory": ${container_memory},
    "networkMode": "awsvpc",
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/${env}/ecs/${container_name}",
          "awslogs-region": "${aws_region}",
          "awslogs-stream-prefix": "ecs"
        }
    },
    "environment": [],
    "secrets": [
      {
        "name": "AMAZON_ACCESS_KEY_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/aws/access-key"
      }, {
        "name": "AMAZON_SECRET_ACCESS_KEY",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/aws/access-secret"
      }, {
        "name": "AMAZON_SNS_CODE_ANALYSIS_TOPIC",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/aws/sns/topic/code-analysis"
      }, {
        "name": "AMAZON_SNS_CROSS_REGION_TOPIC",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/aws/sns/topic/cross-region-replication"
      }, {
        "name": "AMAZON_SNS_ORG_REPLICATION_FILTER",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/aws/sns/topic/filter/org-replication"
      }, {
        "name": "GITHUB_CLIENT_SECRET",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/github/client-secret"
      }, {
        "name": "JWT_SECRET",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/token/secret"
      }, {
        "name": "MODE_ANALYTICS_ACCESS_SECRET",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mode/access-secret"
      }, {
        "name": "MODE_ANALYTICS_API_SECRET",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mode/api-secret"
      }, {
        "name": "MONGOOSE_URI",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mongo/uri"
      }, {
        "name": "PG_PUBLIC_KEY",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/postgres/public-key"
      }, {
        "name": "POSTGRES_CONNECTION",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/postgres/uri"
      },  {
        "name": "GITHUB_APP_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/github/app-id"
      }, {
        "name": "GITHUB_CLIENT_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/github/client-id"
      }, {
        "name": "GITHUB_CALLBACK_URL",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/github/redirect"
      }, {
        "name": "GITHUB_PRIVATE_KEY",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/github/private-key"
      }, {
        "name": "MODE_ANALYTICS_ACCESS_KEY",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mode/access-key"
      }, {
        "name": "MODE_ANALYTICS_REPORT_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mode/report-id"
      }, {
        "name": "MODE_ANALYTICS_MAX_AGE",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mode/max-age"
      }, {
        "name": "MODE_ANALYTICS_ORGANIZATION",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mode/org"
      }, {
        "name": "MODE_ANALYTICS_API_KEY",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mode/api-key"
      }, {
        "name": "MONGOOSE_CERTPATH",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mongo/cert-path"
      }, {
        "name": "PORT",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/port"
      }, {
        "name": "REFRESH_TOKEN_NAME",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/token/name"
      }, {
        "name": "SENDGRID_API_KEY",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/sendgrid/api-key"
      }, {
        "name": "SENDGRID_DEFAULT_SENDER",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/sendgrid/sender"
      }, {
        "name": "TOKENLIFE",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/token/life"
      }, {
        "name": "VERSION",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/version"
      }, {
        "name": "ORG_DOMAIN",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/org-domain"
      }, {
        "name": "ROOT_DOMAIN",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/root-domain"
      }, {
        "name": "ALLOWED_ORIGIN",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/allowed-origin"
      }, {
        "name": "NODE_ENV",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/node-env"
      }, {
        "name": "USER_VOICE_SECRET_KEY",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/uservoice/secretkey"
      }, {
        "name": "MAILCHIMP_SERVER_PREFIX",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mailchimp/serverprefix"
      }, {
        "name": "MAILCHIMP_TOKEN",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mailchimp/token"
      }, {
        "name": "MAILCHIMP_REGISTERED_AND_WAITLIST_USERS_AUDIENCE_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/mailchimp/registeredandwaitlistusersaudienceid"
      }, {
        "name": "CHROME_EXTENSION_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/chrome/extensionid"
      },{
        "name":"INTERCOM_TOKEN",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/intercom-token"
      },{
        "name":"DEFAULT_COLLECTION_NAME",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/default_collection_name"
      }
      ],
    "portMappings": [
      {
        "containerPort": ${port},
        "hostPort": ${port}
      }
    ]
  }
]
