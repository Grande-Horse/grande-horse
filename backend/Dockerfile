FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY ./backend /app/backend

COPY ./backend/src/main/resources/application-secret.yml /app/backend/src/main/resources/application-secret.yml

WORKDIR /app/backend

RUN ./gradlew clean build -x test

RUN find /app/backend/build/libs/ -name "*SNAPSHOT.jar" -exec cp {} /app/app.jar \;

ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
