pipeline {
    agent any

    environment {
        TARGET_BRANCH = 'infra/develop'
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

stage('Load .env File') {
    steps {
        configFileProvider([configFile(fileId: 'env-file', targetLocation: '.env')]) {
            sh 'echo .env file loaded'
            sh 'cp .env ./backend/.env'
            sh 'cp .env ./frontend/web/.env'
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
                    sh 'chmod +x ./backend/gradlew'
                    sh 'docker-compose --env-file .env -f ./docker-compose.yml down || true'
                    sh 'docker-compose --env-file .env -f ./docker-compose.yml up -d --build'
                }
            }
        }
    }
}