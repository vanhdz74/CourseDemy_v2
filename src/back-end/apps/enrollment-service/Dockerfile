FROM eclipse-temurin:17-jre
WORKDIR /app
COPY apps/enrollment-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
