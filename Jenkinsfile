pipeline {
    agent {
        docker { image 'node:16-alpine' }
    }
    options { timestamps () }
    stages {
        stage('Clone Repo') {
            steps {
                script {
                    checkout([$class: 'GitSCM',
                        branches: [[name: "hp/jenkins-build"]],
                        userRemoteConfigs: [[credentialsId: 'scanbot-ci-ssh', url: 'git@github.com:doo/scanbot-sdk-example-web.git']]
                    ])
                }
            }
        }
        stage('Build React App') {
            steps {
                script {
                    sh '''
                        set -ex
                        cd react-js/
                        npm install
                        npm start
                        '''
                }
            }
        }
        stage('Build Plain App') {
            steps {
                script {
                    sh '''
                        set -ex
                        cd plain-js/
                        php -S localhost:8000
                        '''
                }
            }
        }
        stage('Build Angular App') {
            steps {
                script {
                    sh '''
                        set -ex
                        cd angular-js/
                        ng serve
                        ng build
                        ng test
                        ng e2e
                        '''
                }
            }
        }
    }
}