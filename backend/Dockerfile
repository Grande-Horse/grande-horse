FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY . .

RUN ./gradlew clean build -x test

RUN find /app -name "*SNAPSHOT.jar" -exec cp {} /app/app.jar \;

ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar"]
