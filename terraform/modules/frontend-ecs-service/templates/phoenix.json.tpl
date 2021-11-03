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
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/phoenix/client/secret"
      }, 
      {
        "name": "APOLLO_CLIENT_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/phoenix/client/id"
      }, 
      {
        "name": "BASE_URL_APOLLO",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/phoenix/api/endpoint"
      }, 
      {
        "name": "GITHUB_CLIENT_ID",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/github/client-id"
      }, 
      {
        "name": "GITHUB_REDIRECT",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/github/redirect"
      },
      {
        "name":"NEXT_PUBLIC_AMPLITUDE_API_KEY",
        "valueFrom": "arn:aws:ssm:us-east-1:091235034633:parameter/${env}/phoenix/next_public_amplitude_api_key"
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
