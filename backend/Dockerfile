FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY gradlew .
COPY gradle/ gradle/

RUN chmod +x gradlew

COPY . .

RUN ./gradlew clean build -x test

RUN cp build/libs/*SNAPSHOT.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]
