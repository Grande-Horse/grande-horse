pipeline {
    agent any

    environment {
        ACCESS_TOKEN = credentials('ACCESS_TOKEN')
        TARGET_BRANCH = 'infra/develop'
        DB_USERNAME = credentials('DB_USERNAME')
        DB_PASSWORD = credentials('DB_PASSWORD')
        DB_NAME = credentials('DB_NAME')
        REDIS_PASSWORD = credentials('REDIS_PASSWORD')
    }

    stages {
        stage('Check Branch') {
            when {
                expression {
                    return env.BRANCH_NAME == "${TARGET_BRANCH}"
                }
            }
            steps {
                echo "Triggered by push to branch: ${env.BRANCH_NAME}"
            }
        }

        stage('Clone Repository') {
            steps {
                git branch: "${TARGET_BRANCH}",
                    credentialsId: 'ACCESS_TOKEN',
                    url: 'https://lab.ssafy.com/s12-bigdata-dist-sub1/S12P21A606.git'
            }
        }

        stage('Generate .env File') {
            steps {
                script {
                    def envContent = """
                        ACCESS_TOKEN=${env.ACCESS_TOKEN}
                        DB_PASSWORD=${env.DB_PASSWORD}
                        REDIS_PASSWORD=${env.REDIS_PASSWORD}
                        DB_NAME=${env.DB_NAME}
                        DB_USERNAME=${env.DB_USERNAME}
                    """
                    writeFile file: '.env', text: envContent
                }
            }
        }

        stage('Check .env File') {
            steps {
                script {
                    sh 'cat .env'
                }
            }
        }

        stage('Docker Build & Push') {
            when {
                branch 'infra/develop'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'DockerHub_Login', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        docker build -t imkm/grandehorse:backend-latest ./backend
                        docker push imkm/grandehorse:backend-latest

                        docker build -t imkm/grandehorse:frontend-latest ./frontend/web
                        docker push imkm/grandehorse:frontend-latest

                        docker logout
                    """
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    sh 'docker-compose --env-file .env -f ./docker-compose.yml down || true'
                    sh 'docker-compose --env-file .env -f ./docker-compose.yml up -d --build'
                }
            }
        }
    }
}
