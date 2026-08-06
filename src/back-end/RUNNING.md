# Running CourseDemy Backend

Project nay dang theo huong microservice: moi service la mot Spring Boot app
rieng va dung mot database rieng.

## Service ports

- `gateway-service`: `8080`
- `user-service`: `8082`
- `course-service`: `8083`
- `enrollment-service`: `8084`
- `order-service`: `8085`
- `payment-service`: `8086`
- `notification-service`: `8087`

## Service databases

Can co cac database sau:

- `gateway_service_db`
- `user_service_db`
- `course_service_db`
- `enrollment_service_db`
- `order_service_db`
- `payment_service_db`
- `notification_service_db`

Neu chi chay gateway truoc thi chi can `gateway_service_db`.

## Seeded test accounts

Moi service se tao/cap nhat 3 account test khi bat dau chay:

- Admin: `admin@coursedemy.local` / `123456`
- Teacher: `teacher@coursedemy.local` / `123456`
- Student: `student@coursedemy.local` / `123456`

Ba account nay duoc seed trong tung service database de JWT tao tu gateway co
the duoc cac service khac validate theo email/role.

## Option 1: Use Local PostgreSQL With pgAdmin

Dung cach nay neu PostgreSQL dang chay tren may local va em tao database bang
pgAdmin.

1. Mo pgAdmin.
2. Connect toi PostgreSQL local:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres` hoac user local cua em
   - Password: password cua PostgreSQL local
3. Chuot phai `Databases` -> `Create` -> `Database...`
4. Tao cac database can chay. Vi du neu chay gateway:

```text
gateway_service_db
```

Neu chay tat ca service thi tao du 7 database trong muc `Service databases`.

Tao file `.env` tu file mau:

```bash
cp .env.example .env
```

Sua `.env` de tro toi PostgreSQL local:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-local-postgres-password

GATEWAY_SERVICE_DB_NAME=gateway_service_db
USER_SERVICE_DB_NAME=user_service_db
COURSE_SERVICE_DB_NAME=course_service_db
ORDER_SERVICE_DB_NAME=order_service_db
PAYMENT_SERVICE_DB_NAME=payment_service_db
ENROLLMENT_SERVICE_DB_NAME=enrollment_service_db
NOTIFICATION_SERVICE_DB_NAME=notification_service_db
```

Gateway va cac service co dung Redis. Neu em khong cai Redis local, co the chi
chay Redis bang Docker:

```bash
docker compose up -d redis
```

Chay gateway:

```bash
npm run dev:gateway
```

Chay service khac trong terminal rieng:

```bash
npm run dev:user
npm run dev:course
npm run dev:order
npm run dev:payment
npm run dev:enrollment
npm run dev:notification
```

## Option 2: Use Docker Compose For PostgreSQL And Redis

Dung cach nay neu muon Docker tao PostgreSQL + Redis local.

1. Mo Docker Desktop.
2. Tao `.env`:

```bash
cp .env.example .env
```

3. Chay infrastructure:

```bash
npm run compose:up
```

4. Tao database rieng cho cac service:

```bash
npm run db:init
```

`db:init` khong xoa data. Lenh nay chi tao database con thieu.

5. Chay service:

```bash
npm run dev:gateway
```

## Direct Maven Commands

Co the chay khong qua npm script:

```bash
./mvnw -f apps/gateway-service/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev
./mvnw -f apps/user-service/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev
./mvnw -f apps/course-service/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev
./mvnw -f apps/order-service/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev
./mvnw -f apps/payment-service/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev
./mvnw -f apps/enrollment-service/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev
./mvnw -f apps/notification-service/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev
```

Profile `dev` se load them `application-dev.yml`; profile `prod` se load
`application-prod.yml`. Neu khong set profile khi chay truc tiep bang Maven,
Spring Boot chi dung `application.yml`.

Khong chay lenh nay o root:

```bash
./mvnw spring-boot:run
```

Root `pom.xml` chi la parent/aggregator, khong phai app Spring Boot.

## Common Errors

Neu gap:

```text
Failed to execute goal spring-boot:run ... Process terminated with exit code: 1
```

Hay doc log phia tren dong nay. Neu thay:

```text
org.postgresql.util.PSQLException: The connection attempt failed.
Unable to open JDBC Connection
```

Thi PostgreSQL chua chay, sai port, sai password, hoac database chua duoc tao.

Neu dung pgAdmin/local PostgreSQL:

- Kiem tra PostgreSQL local dang running.
- Kiem tra `.env` co dung `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`.
- Kiem tra database nhu `gateway_service_db` da ton tai.

Neu dung Docker:

```bash
docker compose ps
npm run compose:up
npm run db:init
```
