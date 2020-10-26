{
   "Comment":"Athena Code Analysis Pipeline State Machine",
   "StartAt":"Eric",
   "States":{
      "Eric":{
         "Comment":"Executes an AWS Batch Job to Clone the Repository that is Being Analyzed",
         "Type":"Task",
         "Resource":"arn:aws:states:::batch:submitJob.sync",
         "Parameters":{
            "JobDefinition":"${eric_job_definition}",
            "JobName":"${env}-eric-job",
            "JobQueue":"${eric_job_queue}",
            "Parameters": {
               "repo_url.$":"$.analysis.repositoryUrl",
               "org_name.$":"$.analysis.orgName",
               "repo_username.$":"$.analysis.repoUsername",
               "repo_password.$":"$.analysis.repoPassword"
            }
         },
         "End":true,
         "TimeoutSeconds":600
      }
   }
}