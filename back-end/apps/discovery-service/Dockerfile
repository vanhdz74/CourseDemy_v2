# ==========================
# Build Stage
# ==========================
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Parent pom
COPY pom.xml .

# Copy tất cả module pom để Maven resolve dependency graph
COPY gateway-service/pom.xml gateway-service/
COPY discovery-service/pom.xml discovery-service/
COPY auth-service/pom.xml auth-service/
COPY Product-service/pom.xml Product-service/
COPY cart-service/pom.xml cart-service/
COPY order-service/pom.xml order-service/
COPY payment-service/pom.xml payment-service/
COPY notification-service/pom.xml notification-service/

# Download dependency trước để tận dụng cache Docker
RUN mvn dependency:go-offline -B

# Copy source
COPY . .

# Chỉ build module product-service
RUN mvn clean package \
    -pl discovery-service \
    -am \
    -DskipTests

# ==========================
# Runtime Stage
# ==========================
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder \
    /build/discovery-service/target/*.jar \
    app.jar

EXPOSE 8761

ENTRYPOINT ["java","-jar","app.jar"]