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
        "name": "APOLLO_CLIENT_SECRET",
        "value": "d7f3b825-bf97-4f21-babc-cf03a1babe91"
        }, 
       {
        "name": "APOLLO_CLIENT_ID",
        "value": "3f883860-862e-4a49-b149-f56371e87e88"
       }, 
       {
        "name": "BASE_URL_APOLLO",
        "value": "https://api-${env}.semasoftware.io"
      }, 
      {
        "name": "GITHUB_CLIENT_ID",
        "value": "Iv1.1521fdd01686c281"
      }, 
      {
        "name": "GITHUB_REDIRECT",
        "value": "https://api-${env}.semasoftware.io/v1/identities/github/cb"
      }
    ],
    "secrets": [],
    "portMappings": [
      {
        "containerPort": ${port},
        "hostPort": ${port}
      }
    ]
  }
]
