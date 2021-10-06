pipeline {
    agent {
        docker { image 'node:16-alpine' }
    }
    options { timestamps }
    stages {
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