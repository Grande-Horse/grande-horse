pipeline {
    agent any

    environment {
        TARGET_BRANCH = 'master'
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

        stage('Prepare Credentials') {
            steps {
                parallel(
                    BackendCredentials: {
                        withCredentials([file(credentialsId: 'BACKEND_SECRET_YML', variable: 'BACKEND_SECRET')]) {
                            sh 'cp $BACKEND_SECRET backend/src/main/resources/application-secret.yml'
                        }
                    },
                    FrontendCredentials: {
                        withCredentials([file(credentialsId: 'FRONTEND_ENV', variable: 'FRONTEND_ENV_FILE')]) {
                            sh 'cp $FRONTEND_ENV_FILE frontend/web/.env'
                        }
                    }
                )
            }
        }

        stage('Docker Build & Push') {
            when {
                branch 'master'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'DockerHub_Login', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        docker build --no-cache -t imkm/grandehorse:backend-latest ./backend
                        docker push imkm/grandehorse:backend-latest

                        docker build --no-cache -t imkm/grandehorse:frontend-latest ./frontend/web
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
                    sh 'docker-compose -f docker-compose.yml down || true'
                    sh 'docker-compose -f docker-compose.yml build --no-cache'
                    sh 'docker-compose -f docker-compose.yml up -d --remove-orphans'
                }
            }
        }
    }
}
