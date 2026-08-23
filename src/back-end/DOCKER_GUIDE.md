# CourseDemy Backend - Docker & Services Running Guide

Tài liệu này hướng dẫn cách build Docker và chạy các dịch vụ Backend (Microservices) của dự án **CourseDemy** một cách chi tiết.

---

## 1. Yêu cầu hệ thống
* **Docker** & **Docker Compose** đã được cài đặt và đang chạy.
* **Node.js 20+** & **npm** (tùy chọn, dùng để chạy các scripts tự động trong [package.json](file:///Users/hoangvietanh/Documents/My-Project/CourseDemy/src/back-end/package.json)).

---

## 2. Chuẩn bị Environment
Trước khi chạy, hãy copy file môi trường mẫu tại thư mục [src/back-end](file:///Users/hoangvietanh/Documents/My-Project/CourseDemy/src/back-end):

```bash
cd src/back-end
cp .env.example .env
```

Mở file `.env` vừa tạo và điền các cấu hình cần thiết (như JWT_SECRET, tài khoản Mail, v.v.).

---

## 3. Khởi động Cơ sở dữ liệu và Redis
Tất cả các service trong hệ thống đều kết nối tới PostgreSQL và Redis. Khởi động chúng bằng lệnh sau:

```bash
# Khởi động postgres và redis container
docker compose up -d postgres redis
```

Sau khi PostgreSQL khởi động thành công, khởi tạo các database/schemas cho từng service:

```bash
# Sử dụng npm script
npm run db:init

# HOẶC chạy trực tiếp bằng lệnh docker
docker compose exec postgres bash /docker-entrypoint-initdb.d/init-databases.sh
```

---

## 4. Chạy các Dịch vụ bằng Docker

Mỗi Spring Boot service nằm trong thư mục [src/back-end/apps](file:///Users/hoangvietanh/Documents/My-Project/CourseDemy/src/back-end/apps) đều có sẵn `Dockerfile`. 

### A. Chạy Service thông qua Docker Compose (Khuyên dùng)
Bạn có thể khởi động tổ hợp các service cần thiết đã được cấu hình sẵn trong [docker-compose.yml](file:///Users/hoangvietanh/Documents/My-Project/CourseDemy/src/back-end/docker-compose.yml):

* **Chạy Discovery Service (Eureka Server) & API Gateway:**
  ```bash
  docker compose up -d --build discovery-service gateway-service
  ```

* **Chạy thêm các Service khác (ví dụ: course-service):**
  Bạn có thể bổ sung định nghĩa service vào [docker-compose.yml](file:///Users/hoangvietanh/Documents/My-Project/CourseDemy/src/back-end/docker-compose.yml) hoặc build và chạy đơn lẻ như hướng dẫn bên dưới.

---

### B. Build và Chạy thủ công từng Service bằng Docker CLI
Để build ảnh Docker cho bất kỳ service nào, **lưu ý luôn chạy lệnh tại thư mục gốc của backend (`src/back-end`)** do Dockerfile cần truy cập vào thư viện chung (`libs`) và parent `pom.xml`.

#### 1. Build Docker Image
Sử dụng cú pháp:
```bash
docker build -t <tên-service> -f apps/<thư-mục-service>/Dockerfile .
```

*Ví dụ:*
```bash
# Build Gateway Service
docker build -t gateway-service -f apps/gateway-service/Dockerfile .

# Build Course Service
docker build -t course-service -f apps/course-service/Dockerfile .

# Build User Service
docker build -t user-service -f apps/user-service/Dockerfile .
```

#### 2. Run Container đơn lẻ
Khi chạy container thủ công, cần kết nối vào mạng `spring-microservice` của docker-compose để các dịch vụ có thể kết nối với Postgres, Redis và Eureka:

```bash
# Chạy Course Service
docker run -d \
  --name course-service-container \
  --network spring-microservice \
  -p 8083:8083 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e DB_HOST=postgres \
  -e REDIS_HOST=redis \
  -e EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://discovery-service-CourseDemy:8761/eureka \
  course-service
```

---

## 5. Giám sát các Service đang chạy

1. **Eureka Dashboard:**
   Truy cập `http://localhost:8761` trên trình duyệt để kiểm tra trạng thái hoạt động và danh sách các service đã đăng ký thành công (UP).
2. **Xem logs:**
   ```bash
   docker compose logs -f <tên-service-trong-docker-compose>
   ```
   *Ví dụ:* `docker compose logs -f gateway-service`
3. **Dừng hệ thống:**
   ```bash
   docker compose down
   ```
