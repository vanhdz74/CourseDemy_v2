# CourseDemy Backend

Backend da duoc sap xep theo workspace microservice:

```text
backend/
|-- apps/
|   |-- api-gateway/
|   |-- auth-service/
|   |-- user-service/
|   |-- course-service/
|   |-- enrollment-service/
|   |-- order-service/
|   |-- payment-service/
|   `-- notification-service/
|-- libs/
|   |-- common/
|   |-- database/
|   |-- contracts/
|   |-- config/
|   |-- messaging/
|   `-- logger/
|-- docker-compose.yml
|-- package.json
`-- README.md
```

## Service ports

- `api-gateway`: 8080
- `auth-service`: 8081
- `user-service`: 8082
- `course-service`: 8083
- `enrollment-service`: 8084
- `order-service`: 8085
- `payment-service`: 8086
- `notification-service`: 8087

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

Set env variables first:

```bash
export JWT_SECRET=replace-with-local-secret
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
```

Run one service:

```bash
npm run dev:auth
```

Run all services with Docker Compose:

```bash
npm run compose:up
```

Build all services:

```bash
npm run build
```

## Migration note

This is the first microservice workspace split from the old Spring Boot monolith.
Each service now has its own app entrypoint and route boundary. The next cleanup
step is to remove non-owned entities/repositories from each service and replace
cross-domain database access with service clients or events.
