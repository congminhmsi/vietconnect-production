# VIETCONNECT SOLUTIONS - Docker Deployment Guide

Hướng dẫn này cung cấp thông tin về cách triển khai dự án VIETCONNECT SOLUTIONS sử dụng Docker và Docker Compose. Hướng dẫn bao gồm cả môi trường production và development, đảm bảo tích hợp liền mạch với các container MySQL và Redis hiện có.

## 🚀 Bắt Đầu Nhanh

### 1. Yêu Cầu Tiên Quyết

- Docker Desktop đã được cài đặt và đang chạy.
- Các container Docker `mysql-bicrypto` và `redis-bicrypto` đang chạy.
- Node.js và pnpm đã được cài đặt trên máy để thiết lập và build ban đầu.

### 2. Thiết Lập Ban Đầu (Build Locally)

Trước khi build Docker images, bạn cần build frontend và backend trên máy local để tạo các thư mục `dist` và `.next` cần thiết.

```bash
cd D:\sancrypto\soultion
pnpm install
pnpm build:all
```

### 3. Cấu Hình Môi Trường

File `docker.env` đã được tạo cho các biến môi trường dành riêng cho Docker. Đảm bảo các biến sau được thiết lập chính xác:

```env
# D:\sancrypto\soultion\docker.env
# ... (nội dung .env hiện tại của bạn) ...

# Database và Redis hosts trỏ đến tên service Docker của chúng
DB_HOST=mysql-bicrypto
REDIS_HOST=redis-bicrypto

# Backend và WebSocket URLs trỏ đến service Docker backend
NEXT_PUBLIC_BACKEND_URL=http://backend-api:4000
NEXT_PUBLIC_WEBSOCKET_URL=ws://backend-api:4000

# Binance API Keys
APP_BINANCE_API_KEY=7J3cW3Cvq2oH7HeN2e07GKjfanhp4Mco7w7RmARqMueIO5VI1H4afw8fwtQDL9sR
APP_BINANCE_API_SECRET=sblAMXk5jaJE93Yifpge5mEwjXfiQjjAH7wncNeSll1qJVC2Bf0f3DG3Bt95kDeY
```

### 4. Triển Khai trong Production

Để triển khai ứng dụng trong môi trường production sử dụng Docker Compose:

```bash
cd D:\sancrypto\soultion
docker-compose -f docker-compose.yml --env-file docker.env up -d
```

- `--env-file docker.env`: Chỉ định file biến môi trường.
- `-d`: Chạy các container ở chế độ detached (chạy nền).
- `--build`: Thêm flag này nếu bạn muốn rebuild images trước khi khởi động containers.

### 5. Triển Khai trong Development (với Hot-Reload)

Cho development với thay đổi code trực tiếp (hot-reloading):

```bash
cd D:\sancrypto\soultion
docker-compose -f docker-compose.dev.yml --env-file docker.env up -d
```

- `-f docker-compose.dev.yml`: Sử dụng file Docker Compose dành riêng cho development.
- Volume mounts được cấu hình trong `docker-compose.dev.yml` để đồng bộ hóa các thay đổi code local.

### 6. Kiểm Tra Trạng Thái Container

Để xem trạng thái của các containers đang chạy:

```bash
docker-compose ps
```

### 7. Truy Cập Ứng Dụng

- **Frontend**: `http://localhost:3000/en`
- **Backend API**: `http://localhost:4000`

## 📦 Backup và Restore

### Backup MySQL Database

```bash
docker exec mysql-bicrypto mysqldump -u root -p${DB_PASSWORD} ${DB_NAME} > D:\sancrypto\database_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql
```

### Restore MySQL Database

```bash
docker exec -i mysql-bicrypto mysql -u root -p${DB_PASSWORD} ${DB_NAME} < D:\sancrypto\your_backup_file.sql
```

### Backup Redis Data

```bash
docker exec redis-bicrypto redis-cli BGSAVE
docker cp redis-bicrypto:/data/dump.rdb D:\sancrypto\redis_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').rdb
```

### Restore Redis Data

```bash
docker stop redis-bicrypto
docker cp D:\sancrypto\your_redis_backup.rdb redis-bicrypto:/data/dump.rdb
docker start redis-bicrypto
```

### Backup .env file

```bash
copy D:\sancrypto\soultion\.env "D:\sancrypto\.env_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').bak"
```

## ⚠️ Xử Lý Sự Cố

- **"Connection Failed!" cho Binance API**:
  - Đảm bảo Binance API Key của bạn có quyền `Read Info` và `Enable Spot & Margin Trading`.
  - Whitelist địa chỉ IP công khai của máy chủ trong cài đặt Binance API.
  - Tài khoản Binance của bạn phải được xác minh KYC.
  - Khởi động lại Docker containers sau khi thay đổi `.env`: `docker-compose restart`

- **Containers không khởi động**:
  - Kiểm tra `docker-compose logs` để biết thông báo lỗi cụ thể.
  - Đảm bảo các cổng không bị sử dụng trên máy chủ.
  - Xác minh các biến `docker.env` là chính xác.

- **Frontend/Backend không giao tiếp**:
  - Đảm bảo tất cả các services đều nằm trên cùng một mạng Docker (`vietconnect-network`).
  - Xác minh `NEXT_PUBLIC_BACKEND_URL` và `NEXT_PUBLIC_WEBSOCKET_URL` sử dụng tên service chính xác (`http://backend-api:4000`).

## ⚙️ Chi Tiết Cấu Hình Docker

### Network

Một mạng bridge tùy chỉnh `vietconnect-network` được tạo để cho phép giao tiếp liền mạch giữa các services bằng cách sử dụng tên service của chúng.

### Volumes

- `mysql_data`: Lưu trữ liên tục cho cơ sở dữ liệu MySQL.
- `redis_data`: Lưu trữ liên tục cho dữ liệu Redis.
- Đối với development, các thư mục code local được mount làm volumes để hot-reloading.

### Health Checks

Health checks được cấu hình cho tất cả các services để đảm bảo chúng đang chạy và phản hồi trước khi các services phụ thuộc bắt đầu.

---

**VIETCONNECT SOLUTIONS - Sẵn Sàng Triển Khai Docker!**