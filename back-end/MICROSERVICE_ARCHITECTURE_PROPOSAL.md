# CourseDemy Backend Microservice Architecture Proposal

Status: Proposal for review

## 1. Muc tieu

De xuat tach backend hien tai tu mot Spring Boot monolith thanh kien truc microservice theo tung buoc, tranh refactor lon ngay lap tuc.

Muc tieu chinh:

- Tach ro domain: auth, user, course, enrollment, order, payment, notification.
- Giam phu thuoc truc tiep giua cac module.
- Dam bao moi service co database schema rieng khi chuyen sang microservice that.
- Giu REST API on dinh cho frontend thong qua API Gateway.
- Cho phep migration tung phan, khong can dung toan bo he thong.

Khong phai muc tieu o giai doan nay:

- Chua di chuyen code ngay.
- Chua tach database vat ly ngay.
- Chua them Kafka/RabbitMQ neu chua can cho luong nghiep vu thuc te.
- Chua bien tat ca module thanh service doc lap trong mot lan.

## 2. Trang thai hien tai

Backend hien tai la mot Spring Boot app duy nhat:

```text
back-end/
|-- src/main/java/com/vanh/CourseWeb/
|   |-- controller/
|   |-- service/
|   |-- repository/
|   |-- entity/
|   |-- dto/
|   |-- configurations/
|   |-- exception/
|   `-- ...
|-- src/main/resources/
|-- pom.xml
|-- Dockerfile
`-- mvnw
```

Cac domain da co trong code:

- Auth: login, JWT, OTP, reset password.
- User: user profile, role.
- Course: course, category, lesson, sub-lesson, material, course image.
- Review/Comment: review, comment, like.
- Cart/Order: cart, cart item, order, order detail.
- Payment: VNPay, Momo/payment callback.
- Revenue: thong ke doanh thu.
- Notification/Mail: mail service, OTP email.

## 3. Kien truc de xuat

Thu muc dich sau khi duoc duyet:

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
|
|-- libs/
|   |-- common/
|   |-- database/
|   |-- contracts/
|   |-- config/
|   |-- messaging/
|   `-- logger/
|
|-- docker-compose.yml
|-- package.json
`-- README.md
```

Vai tro cua cac file root:

- `docker-compose.yml`: chay local PostgreSQL, Redis, gateway va cac service.
- `package.json`: script dieu phoi dev/build/test cho toan backend, vi du `npm run dev:auth`, `npm run compose:up`.
- `README.md`: huong dan chay local, bien moi truong, port, API route va migration notes.

Khuyen nghi van giu Maven cho tung Spring Boot service:

```text
apps/auth-service/pom.xml
apps/user-service/pom.xml
apps/course-service/pom.xml
apps/enrollment-service/pom.xml
apps/order-service/pom.xml
apps/payment-service/pom.xml
apps/notification-service/pom.xml
apps/api-gateway/pom.xml
libs/*/pom.xml
```

Ly do:

- Phu hop voi repo hien tai dang dung Maven/Spring Boot.
- `package.json` chi nen lam command runner, khong thay the Maven build cua Java service.
- Moi service van build/deploy doc lap bang Maven.

## 4. Ranh gioi service

### api-gateway

Trach nhiem:

- Lam cua vao duy nhat cho frontend.
- Route request den cac service noi bo.
- Xac thuc JWT o gateway cho cac route can auth.
- Rate limit, CORS, logging request.

Khong nen chua business logic.

Route de xuat:

```text
/api/auth/**          -> auth-service
/api/users/**         -> user-service
/api/courses/**       -> course-service
/api/categories/**    -> course-service
/api/lessons/**       -> course-service
/api/enrollments/**   -> enrollment-service
/api/cart/**          -> order-service
/api/orders/**        -> order-service
/api/payments/**      -> payment-service
/api/reviews/**       -> course-service
/api/comments/**      -> course-service
```

### auth-service

Trach nhiem:

- Login/register.
- Tao va verify JWT.
- OTP, forgot password, reset password.
- Quan ly credential/security flow.

Du lieu so huu:

- User credential.
- Refresh token neu co.
- OTP/reset password token.

Phu thuoc:

- Co the goi user-service de tao user profile sau khi register.
- Gui event `AuthRegistered` hoac request den notification-service de gui email.

### user-service

Trach nhiem:

- User profile.
- Role/basic permission.
- Instructor/student profile metadata.

Du lieu so huu:

- User profile.
- Role.

Khong nen:

- Xu ly password.
- Tao order/payment.
- Quan ly noi dung khoa hoc.

### course-service

Trach nhiem:

- Course, category, course detail.
- Lesson, sub-lesson, material.
- Course images/files metadata.
- Review/comment gan voi course.

Du lieu so huu:

- Course.
- Category.
- Lesson/sub-lesson/material.
- Review/comment/like.

Luu y:

- File upload co the van dung Cloudinary/S3.
- Course-service chi luu metadata, khong nen phu thuoc truc tiep vao order/payment.

### enrollment-service

Trach nhiem:

- Quan ly user da mua/duoc ghi danh vao course nao.
- Check access khi user xem lesson/material.
- Cap nhat enrollment sau khi payment/order thanh cong.

Du lieu so huu:

- Enrollment/UserCourse.
- Learning progress neu sau nay can.

Event nhan:

- `OrderPaid`
- `PaymentSucceeded`

### order-service

Trach nhiem:

- Cart.
- Order.
- Order detail.
- Tinh tong tien tai thoi diem dat hang.
- Tao payment request qua payment-service.

Du lieu so huu:

- Cart.
- Cart item.
- Order.
- Order detail.

Event phat:

- `OrderCreated`
- `OrderCancelled`
- `OrderPaid`

### payment-service

Trach nhiem:

- Tich hop VNPay/Momo.
- Tao payment URL.
- Xu ly callback/IPN.
- Verify payment signature.
- Cap nhat trang thai payment.

Du lieu so huu:

- Payment transaction.
- Provider request/response metadata can thiet cho doi soat.

Event phat:

- `PaymentSucceeded`
- `PaymentFailed`

### notification-service

Trach nhiem:

- Gui email.
- Gui OTP email, order confirmation, payment success.
- Sau nay co the them in-app notification.

Du lieu so huu:

- Notification log.
- Email template neu can.

Event nhan:

- `UserRegistered`
- `PasswordResetRequested`
- `OrderPaid`
- `PaymentSucceeded`

## 5. Thu vien dung chung

### libs/common

Chua cac class that su dung chung:

- `ApiResponse`
- `PageResponse`
- `PageMeta`
- `ApiError`
- common exception base class
- common validation utilities neu can

Luu y: tranh dua business logic vao common.

### libs/contracts

Chua contract giua cac service:

- Request/response DTO public.
- Event schema.
- Error code chung.

Vi du:

```text
contracts/
|-- auth/
|-- user/
|-- course/
|-- order/
|-- payment/
`-- events/
```

### libs/config

Chua cau hinh dung chung:

- Security helper.
- Jackson config.
- CORS defaults.
- OpenAPI config neu co.

### libs/database

Chi chua helper database dung chung, khong chua entity business cua service khac.

Co the gom:

- Base entity.
- Audit fields.
- Migration conventions.

### libs/messaging

Neu dung event bus:

- Message publisher interface.
- Message consumer base.
- Event metadata.
- Retry/dead-letter conventions.

### libs/logger

- Structured logging.
- Correlation ID.
- Request trace filter.

## 6. Database ownership

Giai doan dau co the van dung chung mot PostgreSQL instance, nhung moi service nen co schema rieng:

```text
auth_schema
user_schema
course_schema
enrollment_schema
order_schema
payment_schema
notification_schema
```

Quy tac:

- Service chi duoc doc/ghi schema cua minh.
- Khong join truc tiep bang cua service khac.
- Can du lieu service khac thi goi API noi bo hoac dung event da dong bo.
- ID tham chieu cross-service nen la ID, khong mapping JPA relation truc tiep.

Vi du:

- `order-service` luu `user_id`, `course_id`, snapshot ten course/gia tai thoi diem order.
- `enrollment-service` luu `user_id`, `course_id`, `order_id`.
- `course-service` khong biet chi tiet payment/order.

## 7. Giao tiep giua services

### REST sync

Dung cho request can ket qua ngay:

- Gateway -> services.
- order-service -> payment-service de tao payment.
- enrollment-service -> course-service de verify course ton tai neu can.

### Event async

Dung cho side effect:

- payment-service phat `PaymentSucceeded`.
- order-service nhan payment success va cap nhat order paid.
- enrollment-service nhan order paid va tao enrollment.
- notification-service nhan event va gui email.

Event de xuat:

```text
UserRegistered
PasswordResetRequested
OrderCreated
PaymentRequested
PaymentSucceeded
PaymentFailed
OrderPaid
EnrollmentCreated
```

Giai doan dau co the dung synchronous service call hoac Spring application event trong modular monolith. Khi deploy microservice that thi chuyen sang RabbitMQ/Kafka.

## 8. Security

De xuat:

- `auth-service` phat JWT.
- `api-gateway` verify JWT va forward identity qua header noi bo:
  - `X-User-Id`
  - `X-User-Role`
  - `X-Correlation-Id`
- Service noi bo van validate permission theo domain.
- Khong tin header user tu public internet, chi chap nhan tu gateway/internal network.

Permission examples:

- User chi update profile cua chinh minh, tru admin.
- Instructor chi sua course cua minh.
- User chi xem lesson neu da enrollment hoac la owner/admin.
- Payment callback phai verify signature tu provider.

## 9. Migration plan

### Phase 1: Modular monolith

Muc tieu: sap xep lai code theo domain trong cung mot app, it rui ro nhat.

De xuat package:

```text
com.vanh.coursedemy/
|-- common/
|-- auth/
|-- user/
|-- course/
|-- enrollment/
|-- order/
|-- payment/
`-- notification/
```

Viec can lam:

- Gom controller/service/repository/entity/dto theo domain.
- Giam dung chung entity giua domain.
- Tao DTO/contract ro cho cac domain call nhau.
- Bo dan cac util dang phu thuoc repository cross-domain.

### Phase 2: Backend workspace scaffold

Muc tieu: tao boundary theo workspace `apps/` va `libs/`, nhung van cho phep deploy chung trong local/dev.

Tao:

```text
backend/
|-- apps/api-gateway
|-- apps/auth-service
|-- apps/user-service
|-- apps/course-service
|-- apps/enrollment-service
|-- apps/order-service
|-- apps/payment-service
|-- apps/notification-service
|-- libs/common
|-- libs/database
|-- libs/contracts
|-- libs/config
|-- libs/messaging
|-- libs/logger
|-- docker-compose.yml
|-- package.json
`-- README.md
```

Moi app co Spring Boot main class va config rieng. Root `package.json` chi dung de gom script tien ich, vi du:

```json
{
  "scripts": {
    "compose:up": "docker compose up -d",
    "compose:down": "docker compose down",
    "dev:auth": "cd apps/auth-service && ./mvnw spring-boot:run",
    "build:auth": "cd apps/auth-service && ./mvnw clean package"
  }
}
```

### Phase 3: Database schema separation

Muc tieu: moi service so huu schema rieng.

Viec can lam:

- Tao migration SQL/Flyway/Liquibase cho tung schema.
- Thay JPA relationship cross-domain bang ID reference.
- Them API/event de dong bo du lieu can thiet.

### Phase 4: Runtime microservices

Muc tieu: chay doc lap bang Docker Compose.

Thanh phan:

- API Gateway.
- PostgreSQL.
- Redis.
- RabbitMQ/Kafka neu can event bus.
- Cac service Spring Boot.

### Phase 5: Observability va hardening

Muc tieu:

- Correlation ID.
- Centralized logs.
- Health checks.
- Metrics.
- Retry/dead-letter cho event.
- API contract tests.

## 10. Thu tu tach uu tien

Khuyen nghi:

1. `notification-service`: tach de nhat, it lien quan domain chinh.
2. `payment-service`: co boundary ro voi VNPay/Momo callback.
3. `auth-service`: quan trong, can lam can than vi lien quan security.
4. `course-service`: domain lon, nen tach sau khi package da gon.
5. `order-service`: lien quan cart/order/payment/enrollment.
6. `enrollment-service`: tach sau khi order/payment event da ro.
7. `api-gateway`: dua vao khi da co it nhat 2 service doc lap.

## 11. Rui ro can duyet

- Microservice co overhead lon hon monolith: deploy, monitoring, config, network error.
- Tach database qua som se lam tang chi phi refactor.
- Cross-service transaction phai thiet ke bang event/saga, khong con transaction SQL truc tiep.
- Neu team nho, nen di theo modular monolith truoc de tranh phuc tap van hanh.

## 12. Quyet dinh can phe duyet

Can chot cac diem sau truoc khi code:

- Dung mot repo `backend/` voi `apps/` va `libs/`, hay tach thanh nhieu repository rieng?
- Root `package.json` chi lam command runner, con moi service Java van dung Maven, co dong y khong?
- Giai doan dau van giu mot PostgreSQL database voi nhieu schema hay tach database vat ly?
- Dung event bus nao: RabbitMQ, Kafka, hay chua dung o phase dau?
- API Gateway dung Spring Cloud Gateway hay gateway khac?
- Package service moi dung convention `com.coursedemy.<service>`, vi du `com.coursedemy.course`.

## 13. De xuat phe duyet

Phuong an nen duyet:

- Phase 1 refactor thanh modular monolith truoc.
- Phase 2 tao dung workspace `backend/apps`, `backend/libs`, `docker-compose.yml`, `package.json`, `README.md`.
- Giu Maven va Spring Boot ben trong tung service.
- Dung root `package.json` lam script runner cho dev/build/compose.
- Ban dau dung chung mot PostgreSQL instance, moi service/schema rieng.
- Dung REST truoc, them RabbitMQ cho payment/order/enrollment/notification khi tach runtime.

Ly do:

- It rui ro voi code hien tai.
- Van tien gan den microservice dung chuan.
- Cho phep frontend tiep tuc dung API cu qua gateway/router.
- Co the review va test tung domain sau moi lan tach.
