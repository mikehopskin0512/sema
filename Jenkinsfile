#!/usr/bin/env groovy
@Library(['customSlackLibrary', 'jenkinsSharedLibs']) _
pipeline {
    agent {
        docker {
            image 'cimg/base:2022.01'
            args '-u root --privileged --net host'
        }
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    environment {
        GIPHY_KEY = credentials('giphyKey')
    }

    stages {
        stage('Install dependencies') {
            steps {
                sh 'apt-get update -y && apt-get install -y awscli'
            }
        }

        stage('Prepare the environment') {
            steps {
                script {
                    addHeadBuildName()
                    release_regex = '(.*release.*)'
                    switch (GIT_BRANCH) {
                    case 'master':
                            env.ENVIRONMENT = 'prod'
                            break
                    case ['qa', 'qa1']:
                            env.ENVIRONMENT = GIT_BRANCH
                            break
                    case 'develop':
                            env.ENVIRONMENT = 'staging'
                            break
                    case ~/$release_regex/:
                            env.ENVIRONMENT = 'release'
                            break
                    default:
                            env.ENVIRONMENT = 'undefined'
                            error('Aborting the build. The environment is ' + env.ENVIRONMENT) // Abort the build
                            break
                    }

                    JOB_PARAMETERS = [string(name: 'ENVIRONMENT', value: env.ENVIRONMENT), string(name: 'BRANCH_NAME', value: GIT_BRANCH )]
                }
            }
            post {
                failure {
                    slackSendsFail(env.JOB_NAME, GIT_BRANCH, BUILD_URL)
                }
            }
        }

        stage('Run jobs') {
            failFast true
            parallel {
                stage('Run web job') {
                    steps {
                        script {
                            build job: 'Jobs/scr-web-deploy' , parameters: JOB_PARAMETERS
                        }
                    }
                }
                stage('Run CE job') {
                    steps {
                        script {
                            build job: 'Jobs/scr-build-chrome-extension' , parameters: JOB_PARAMETERS, propagate: false
                        }
                    }
                }
                stage('Run apollo job') {
                    steps {
                        script {
                            build job: 'Jobs/scr-apollo-deploy' , parameters: JOB_PARAMETERS
                        }
                    }
                }
            }
        }

        stage('Test web') {
            when { branch pattern: '.*release.*', comparator: 'REGEXP' }
            steps {
                withAWS(role:'jenkins-role-to-assume', region:'us-east-1') {
                    sh """
                    aws ecs wait services-stable --cluster "${env.ENVIRONMENT}-frontend" --services apollo phoenix
                    """
                }

                slackSendsRelease(GIT_BRANCH, env.GIPHY_KEY)

                build job: 'Regression-tests', propagate: false
            }
            post {
                failure {
                    slackSendsFail(env.JOB_NAME, GIT_BRANCH, BUILD_URL)
                }
            }
        }
    }

    post {
        success {
            slackSendsSuccess(env.JOB_NAME, GIT_BRANCH, BUILD_URL)
        }
    }
}
