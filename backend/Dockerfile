FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY ./backend/src/main/resources/application-secret.yml ./application-secret.yml  # 수정됨
COPY ./backend .

RUN ./gradlew clean build -x test

RUN find /app -name "*SNAPSHOT.jar" -exec cp {} /app/app.jar \;

ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]
