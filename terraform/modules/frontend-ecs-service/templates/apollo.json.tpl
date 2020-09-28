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
        "name": "POSTGRES_CONNECTION",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/postgres/uri"
      }, {
        "name": "ALLOWED_ORIGIN",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/cors"
      }, {
        "name": "GITHUB_CLIENT_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/github/client-id"
      }, {
        "name": "GITHUB_CALLBACK_URL",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/github/redirect"
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
        "name": "ORG_DOMAIN",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/apollo/org-domain"
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
      }],
    "portMappings": [
      {
        "containerPort": ${port},
        "hostPort": ${port}
      }
    ]
  }
]
