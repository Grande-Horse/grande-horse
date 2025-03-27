pipeline {
    agent any

    environment {
        TARGET_BRANCH = 'infra/develop'
    }

    stages {
        stage('Check Branch') {
            when {
                expression {
                    return GIT_BRANCH == "${TARGET_BRANCH}"
                }
            }
            steps {
                echo "Triggered by push to branch: ${GIT_BRANCH}"
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    sh """
                        git init
                        git remote add origin https://lab.ssafy.com/s12-bigdata-dist-sub1/S12P21A606.git
                        git fetch origin ${TARGET_BRANCH}
                        git checkout -b ${TARGET_BRANCH} origin/${TARGET_BRANCH}
                    """
                }
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
                branch 'infra/develop'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'DockerHub_Login', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        def imageTag = "${TARGET_BRANCH}-${env.BUILD_NUMBER}"
                        sh """
                            echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                            docker build -t imkm/grandehorse:backend-${imageTag} ./backend
                            docker push imkm/grandehorse:backend-${imageTag}

                            docker build -t imkm/grandehorse:frontend-${imageTag} ./frontend/web
                            docker push imkm/grandehorse:frontend-${imageTag}

                            docker logout
                        """
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    sh 'chmod +x ./backend/gradlew'
                    sh 'docker-compose --env-file ./frontend/web/.env -f ./docker-compose.yml down || true'
                    sh 'docker-compose --env-file ./frontend/web/.env -f ./docker-compose.yml up -d --build'
                }
            }
        }
    }
}
