# CourseDemy Backend

Backend da duoc sap xep theo workspace microservice:

## Structure

```text
backend/
|-- apps/
|   |-- gateway-service/
|   |-- user-service/
|   |-- course-service/
|   |-- enrollment-service/
|   |-- order-service/
|   |-- payment-service/
|   |-- notification-service/
|-- libs/
|   |-- common/
|   |-- database/
|   |-- contracts/
|   |-- config/
|   |-- messaging/
|   |-- logger/
|-- docker-compose.yml
|-- package.json
|-- README.md
```

## Service ports

- `gateway-service`: 8080
- `user-service`: 8082
- `course-service`: 8083
- `enrollment-service`: 8084
- `order-service`: 8085
- `payment-service`: 8086
- `notification-service`: 8087

## Service databases

Local development uses one PostgreSQL container with one database per service:

- `gateway-service`: `gateway_service_db`
- `user-service`: `user_service_db`
- `course-service`: `course_service_db`
- `enrollment-service`: `enrollment_service_db`
- `order-service`: `order_service_db`
- `payment-service`: `payment_service_db`
- `notification-service`: `notification_service_db`

The init script at `docker/postgres/init-databases.sh` creates these databases
when the Postgres volume is created for the first time. Run `npm run db:init`
after `npm run compose:up` if the local volume already exists.

## Layer convention

- `controller`: nhan HTTP request.
- `service`: xu ly nghiep vu.
- `repository`: truy van database.
- `entity`: anh xa bang database.
- `dto/request`: du lieu client gui len.
- `dto/response`: du lieu tra ve client.
- `mapper`: chuyen entity va DTO.
- `exception`: xu ly loi.
- `client`: goi service khac bang Feign/REST client.
- `event`: Kafka/RabbitMQ event.
- `specification`: filter dong voi JPA Specification.
- `config`: security, gateway, messaging, redis, swagger.
- `util`: helper dung trong service.

## Run local

See [RUNNING.md](RUNNING.md) for the full local running guide, including local
PostgreSQL with pgAdmin and Docker Compose.

Set env variables first:

```bash
cp .env.example .env
```

Start local infrastructure:

```bash
npm run compose:up
npm run db:init
```

Run one service:

```bash
npm run dev:user
```

Or run a service directly with Maven:

```bash
./mvnw -f apps/user-service/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev
```

Run each service in a separate terminal when developing without Docker Compose
for the app services. The root Maven project is only the parent/aggregator and
does not start all Spring Boot applications with one `spring-boot:run` command.

Available service scripts: `dev:gateway`, `dev:user`, `dev:course`,
`dev:order`, `dev:payment`, `dev:enrollment`, `dev:notification`.
These scripts run with the `dev` Spring profile, so each service loads both
`application.yml` and `application-dev.yml`. Use `SPRING_PROFILES_ACTIVE=prod`
or `-Dspring-boot.run.profiles=prod` for production-style config.

Build all services:

```bash
npm run build
```

## Migration note

This is the first microservice workspace split from the old Spring Boot monolith.
Each service now has its own app entrypoint and route boundary. The next cleanup
step is to remove non-owned entities/repositories from each service and replace
cross-domain database access with service clients or events.
