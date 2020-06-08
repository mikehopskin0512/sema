[
  {
    "name": "${cluster_name}",
    "image": "${app_image}",
    "cpu": ${fargate_cpu},
    "memory": ${fargate_memory},
    "networkMode": "awsvpc",
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/${env}-${cluster_name}",
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
        "containerPort": ${app_port},
        "hostPort": ${app_port}
      }
    ]
  }
]
