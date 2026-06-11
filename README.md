# CourseDemy

CourseDemy là nền tảng học và bán khóa học lập trình trực tuyến. Dự án tách riêng frontend Next.js và backend Spring Boot, sử dụng PostgreSQL, JWT và REST API.

## Công nghệ

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, NextAuth, Axios
- Backend: Java Spring Boot, Spring Security, JWT, Maven
- Database: PostgreSQL
- DevOps: Docker, Docker Compose

## Yêu cầu cài đặt

- Git
- Docker và Docker Compose nếu chạy bằng container
- Node.js 20+ và npm nếu chạy frontend thủ công
- Java 17+ và Maven wrapper nếu chạy backend thủ công
- PostgreSQL nếu không dùng Docker

## Clone source

```bash
git clone <repository-url>
cd CourseDemy
```

Thay `<repository-url>` bằng URL Git của dự án, ví dụ URL HTTPS hoặc SSH trên GitHub/GitLab.

## Cấu hình biến môi trường

Không commit file `.env`, `.env.local` hoặc các giá trị bí mật lên Git. Luôn copy từ file example rồi thay bằng giá trị local của bạn.

### Chạy bằng Docker Compose

Docker Compose đọc file `.env` ở thư mục root.

```bash
cp .env.example .env
```

Mở file `.env` và kiểm tra các biến chính:

```env
BACKEND_PORT=8080
FRONTEND_PORT=3000
POSTGRES_PORT=5434

FRONTEND_URL=http://localhost:3000
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
BACKEND_INTERNAL_URL=http://backend:8080

SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/coursedemy_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=coursedemy_db
```

Tạo secret local:

```bash
openssl rand -base64 32
```

Gán kết quả cho `JWT_SECRET`. Tạo thêm secret riêng cho `AUTH_SECRET` khi chạy thật.

### Chạy frontend thủ công

```bash
cd front-end
cp .env.example .env.local
npm install
npm run dev
```

Biến frontend cần cấu hình trong `front-end/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
BACKEND_INTERNAL_URL=http://localhost:8080
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=change-me
```

Nếu dùng Google login hoặc chatbot, điền thêm:

```env
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_WEATHER_API_KEY=
```

### Chạy backend thủ công

```bash
cd back-end
cp .env.example .env
```

Nếu database PostgreSQL chạy local ở port mặc định `5432`, dùng:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/coursedemy_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=change-me
```

Nếu dùng PostgreSQL của Docker Compose, port expose mặc định trong repo là `5434`, dùng:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5434/coursedemy_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

## Chạy dự án

### Cách 1: Docker Compose

Từ thư mục root:

```bash
docker compose up -d --build
```

Sau khi container khởi động:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- PostgreSQL: localhost:5434

Dừng container:

```bash
docker compose down
```

Xóa cả volume database local:

```bash
docker compose down -v
```

### Cách 2: Chạy từng phần

Chạy PostgreSQL trước, sau đó chạy backend:

```bash
cd back-end
../mvnw spring-boot:run
```

Mở terminal khác và chạy frontend:

```bash
cd front-end
npm install
npm run dev
```

## Lệnh kiểm tra

Frontend:

```bash
cd front-end
npm run lint
npm run build
```

Backend:

```bash
cd back-end
../mvnw test
```

## Cấu trúc thư mục

```text
CourseDemy/
├── back-end/          # Spring Boot API
├── front-end/         # Next.js app
├── docs/              # Tài liệu dự án
├── docker-compose.yml
├── .env.example       # Env mẫu cho Docker Compose
└── README.md
```

## Lưu ý

- `JWT_SECRET` phải là Base64 hợp lệ và decode ra tối thiểu 32 bytes cho HS256.
- `BACKEND_INTERNAL_URL=http://backend:8080` chỉ dùng trong Docker network. Khi chạy frontend thủ công, đặt thành `http://localhost:8080`.
- Nếu đổi port backend, cập nhật cả `NEXT_PUBLIC_API_URL`, `BACKEND_INTERNAL_URL` và `FRONTEND_URL` cho phù hợp.
- Các biến email, Google OAuth, Gemini, Weather và VNPAY có thể để trống khi không dùng tính năng tương ứng.
