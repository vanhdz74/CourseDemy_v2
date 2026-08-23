FROM eclipse-temurin:17-jre
WORKDIR /app
COPY apps/gateway-service/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
