{
   "Comment":"SCQP Code Analysis Pipeline State Machine",
   "StartAt":"Orchestrator",
   "States":{
      "Orchestrator":{
         "Comment":"Invokes the orchestrator fargate task when an analysis is triggered from Phoenix",
         "Type":"Task",
         "Resource":"arn:aws:states:::ecs:runTask.sync",
         "Parameters":{
            "LaunchType":"FARGATE",
            "Cluster":"${cluster_arn}",
            "TaskDefinition":"${env}-orchestrator",
            "PlatformVersion": "1.4.0",
            "NetworkConfiguration":{
               "AwsvpcConfiguration":{
                  "Subnets": [
                     "subnet-0a7d97926a60caba6",
                     "subnet-0cef4853f4dfa40a5",
                     "subnet-0e60e6d5641f83be4"
                  ],
                  "AssignPublicIp": "DISABLED"
               }
            },
            "Overrides":{
               "ContainerOverrides":[
                  {
                     "Name":"${env}-orchestrator",
                     "Environment":[
                        {
                           "Name": "INGEST_OPTIONS",
                           "Value.$": "States.Format('runId:{}__projectId:{}', $.runId, $.projectId)"
                        }
                     ]
                  }
               ]
            }
         },
         "End":true,
         "TimeoutSeconds":600
      }
   }
}