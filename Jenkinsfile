#!/usr/bin/env groovy
@Library('customSlackLibrary') _
pipeline {
    agent any

    environment {
        BRANCH_NAME = "${GIT_BRANCH.split('/')[1]}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timestamps()
    }

    stages {
        stage('Run jobs') {
            steps {
                script {
                    release_regex = '(.*release.*)'
                    env.BRANCH_NAME = BRANCH_NAME

                    switch (BRANCH_NAME) {
                    case 'master':
                            env.ENVIRONMENT = 'prod'
                            buildWeb(env.ENVIRONMENT, BRANCH_NAME)
                            break
                    case ['qa']:
                            env.ENVIRONMENT = 'qa'
                            buildWeb(env.ENVIRONMENT, BRANCH_NAME)
                            break
                    case ['qa1']:
                            env.ENVIRONMENT = 'qa1'
                            buildWeb(env.ENVIRONMENT, BRANCH_NAME)
                            break
                    case ~/$release_regex/:
                            env.ENVIRONMENT = 'staging'
                            buildWeb(env.ENVIRONMENT, BRANCH_NAME)
                            break
                    default:
                            env.ENVIRONMENT = 'undefined'
                            error('Aborting the build. The environment is ' + env.ENVIRONMENT) // Abort the build
                            break
                    }
                }

                parallel {
                    stage('Run web job') {
                        build job: 'web/Jenkinsfile' , parameters: [
                            string(name: 'ENVIRONMENT', value: env.ENVIRONMENT),
                            string(name: 'BRANCH_NAME', value: env.BRANCH_NAME)
                            ]
                    // "${env.ENVIRONMENT}-scr-web-deploy"
                    }
                }
            }
        }
    }

    post {
        failure {
            slackSendsFail(env.JOB_NAME, env.BRANCH_NAME, BUILD_URL)
        }
    }
}
