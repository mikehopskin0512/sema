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
        "name": "APOLLO_CLIENT_SECRET",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/qa/phoenix/client/secret"
      }, {
        "name": "APOLLO_CLIENT_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/qa/phoenix/client/id"
      }, {
        "name": "BASE_URL_APOLLO",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/qa/phoenix/api/endpoint"
      }, {
        "name": "GITHUB_CLIENT_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/qa/github/client-id"
      }, {
        "name": "GITHUB_REDIRECT",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/qa/github/redirect"
      }],
    "portMappings": [
      {
        "containerPort": ${port},
        "hostPort": ${port}
      }
    ]
  }
]
