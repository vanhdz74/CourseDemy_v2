# 🎓 CourseDemy

> Nền tảng học và bán khóa học lập trình trực tuyến, hỗ trợ học viên học tập, giảng viên quản lý khóa học và admin vận hành hệ thống.

---

## 🚀 CourseDemy Version 2

CourseDemy v2 là phiên bản nâng cấp tập trung vào trải nghiệm người dùng, xác thực bảo mật hơn, cấu trúc dự án rõ ràng hơn và hỗ trợ triển khai bằng Docker.

### Điểm nổi bật

- Giao diện học tập và quản lý được cải thiện
- Đăng nhập / đăng ký với JWT và NextAuth
- Phân quyền theo vai trò: Học viên, Giảng viên, Admin
- Quản lý khóa học, bài học, danh mục, người dùng
- Giỏ hàng, thanh toán và lịch sử giao dịch
- Thống kê doanh thu cho admin / giảng viên
- Cấu trúc frontend và backend tách biệt
- Hỗ trợ Docker Compose cho môi trường local

---

## 👥 Vai trò hệ thống

### Học viên

- Tìm kiếm và xem chi tiết khóa học
- Mua khóa học
- Học video bài giảng trực tuyến
- Quản lý khóa học đã mua
- Cập nhật hồ sơ cá nhân

### Giảng viên

- Quản lý khóa học của mình
- Quản lý bài học và nội dung giảng dạy
- Theo dõi doanh thu cá nhân

### Admin

- Quản lý người dùng
- Quản lý khóa học và danh mục
- Quản lý đơn hàng / thanh toán
- Theo dõi thống kê hệ thống

---

## 🧩 Công nghệ sử dụng

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- NextAuth
- Axios

### Backend

- Java Spring Boot
- Spring Security
- JWT Authentication
- REST API
- PostgreSQL
- Maven

### DevOps

- Docker
- Docker Compose

---

## ⚙️ Chạy dự án với Docker

```bash
docker compose up -d --build
