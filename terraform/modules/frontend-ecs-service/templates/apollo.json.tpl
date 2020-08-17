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
    "environment": [
      {
        "name": "NEXT_PUBLIC_BASE_URL",
        "value": "arn:aws:ssm:us-east-1:091235034633:parameter/qa/phoenix/web/api-base-url"
      }, {
        "name": "NEXT_PUBLIC_AUTH_JWT",
        "value": "arn:aws:ssm:us-east-1:091235034633:parameter/qa/phoenix/web/auth-jwt"
      }],
      "secrets": [
      {
        "name": "NEXT_PUBLIC_HEAP_ANALYTICS_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/qa/phoenix/web/heap-analytics-id"
      }],
    "portMappings": [
      {
        "containerPort": ${port},
        "hostPort": ${port}
      }
    ]
  }
]
