# ===== Stage 1: Build bằng Maven =====
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# ===== Stage 2: Run app =====
FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java","-jar","app.jar"]


## JDK sử dụng
#FROM openjdk:27-ea-oraclelinux9
#
#WORKDIR /tmp
#
## Copy jar
#ADD target/CourseDemyWeb.jar CourseDemyWeb.jar
#
## Chạy app
#ENTRYPOINT ["java", "-jar", "CourseDemyWeb.jar"]


#ex:
#FROM openjdk:27-ea-trixie
#ADD target/webff-0.0.1-SNAPSHOT.jar webff-0.0.1-SNAPSHOT.jar
#ENTRYPOINT ["java", "-jar", "/webQA-0.0.1-SNAPSHOT.jar"]

#docker commit --change='CMD ["java","-jar","/tmp/CourseDemyWeb.jar"]' tuFileNao newImageName
