FROM openjdk:17-jdk


COPY ./backend/build.gradle ./backend/settings.gradle ./
COPY ./backend/src ./src

RUN ./gradlew build -x test

COPY ./backend/build/libs/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]