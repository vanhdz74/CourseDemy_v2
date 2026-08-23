FROM eclipse-temurin:17-jre
WORKDIR /app
COPY apps/notification-service/target/*.jar app.jar
EXPOSE 8087
ENTRYPOINT ["java", "-jar", "app.jar"]
