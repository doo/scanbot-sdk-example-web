pipeline {
    agent any
    options { timestamps () }
    stages {
        stage('Clone Repo') {
            steps {
                script {
                    checkout([$class: 'GitSCM',
                        branches: [[name: "hp/jenkins-build"]],
                        userRemoteConfigs: [[url: 'git@github.com:doo/scanbot-sdk-example-web.git']]
                    ])
                }
            }
        }
        stage('Build React App') {
            steps {
                script {
                    sh '''
                        set -ex
                        docker run -v "$(pwd)":/build --rm --name scanbot-web-react-build node:16-alpine /bin/bash build_scripts/build_react.sh
                        '''
                }
            }
        }
        stage('Build Plain App') {
            steps {
                script {
                    sh '''
                        set -ex
                        docker run -v "$(pwd)":/build --rm --name scanbot-web-plain-build node:16-alpine /bin/bash build_scripts/build_plain.sh
                        '''
                }
            }
        }
        stage('Build Angular App') {
            steps {
                script {
                    sh '''
                        set -ex
                        docker run -v "$(pwd)":/build --rm --name scanbot-web-angular-build node:16-alpine /bin/bash build_scripts/build_angular.sh
                        '''
                }
            }
        }
    }
}