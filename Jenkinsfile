pipeline {
    agent any

    environment {
        ACCESS_TOKEN = credentials('ACCESS_TOKEN')
        DB_VOLUME = credentials('DB_VOLUME')
        REDIS_VOLUME = credentials('REDIS_VOLUME')
        DB_PASSWORD = credentials('DB_PASSWORD')
        REDIS_PASSWORD = credentials('REDIS_PASSWORD')
        DB_NAME = credentials('DB_NAME')
        DB_USERNAME = credentials('DB_USERNAME')
        TARGET_BRANCH = 'origin/infra/develop'
    }

    stages {
            stage('Check Branch') {
                when {
                    expression {
                        return env.GIT_BRANCH == TARGET_BRANCH
                    }
                }
                steps {
                    echo "Triggered by push to branch: ${env.GIT_BRANCH}"
                }
            }

            stage('Clone Repository') {
                steps {
                    git branch: "${TARGET_BRANCH}", url: 'https://lab.ssafy.com/s12-bigdata-dist-sub1/S12P21A606.git'
                }
            }

            stage('Generate .env File') {
                        steps {
                            writeFile file: '.env', text: """
                                ACCESS_TOKEN=${ACCESS_TOKEN}
                                DB_VOLUME=${DB_VOLUME}
                                REDIS_VOLUME=${REDIS_VOLUME}
                                DB_PASSWORD=${DB_PASSWORD}
                                REDIS_PASSWORD=${REDIS_PASSWORD}
                                DB_NAME=${DB_NAME}
                                DB_USERNAME=${DB_USERNAME}
                            """
                        }
                    }

            stage('Build Backend') {
                steps {
                    dir('backend') {
                        env.PATH = "${tool 'gradle'}/bin:${env.PATH}"
                        sh 'gradle clean build -x test'
                        sh 'cp build/libs/*.jar ./app.jar'
                    }
                }
            }

            stage('Build Frontend') {
                steps {
                    dir('frontend/web') {
                        sh 'pnpm install'
                        sh 'pnpm build'
                    }
                }
            }

            stage('Docker Build & Push') {
                when {
                    branch 'infra/develop'
                }
                steps {
                    withCredentials([usernamePassword(credentialsId: 'DockerHub_Login', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"

                        sh "docker build -t imkm/grandehorse:backend-latest ./backend"
                        sh "docker push imkm/grandehorse:backend-latest"

                        sh "docker build -t imkm/grandehorse:frontend-latest ./frontend/web"
                        sh "docker push imkm/grandehorse:frontend-latest"

                        sh "docker logout"
                    }
                }
            }

            stage('Deploy with Docker Compose') {
                steps {
                    sh 'docker-compose down || true'
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }
