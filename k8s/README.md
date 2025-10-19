# 🚀 Bicrypto K3s Deployment Guide

Hướng dẫn deployment dự án Bicrypto lên Kubernetes (K3s).

## 📋 Yêu cầu

- K3s cluster đã được setup
- kubectl đã được cấu hình
- Docker registry (Docker Hub, Harbor, etc.)
- Domain name (tùy chọn)

## 🔧 Chuẩn bị

### 1. Cập nhật cấu hình

**Cập nhật `configmap.yaml`:**
```yaml
NEXT_PUBLIC_SITE_URL: "https://your-domain.com"
```

**Cập nhật `secret.yaml`:**
```bash
# Tạo base64 encoded passwords
echo -n "your_db_password" | base64
echo -n "your_redis_password" | base64
echo -n "your_jwt_secret" | base64
echo -n "your_nextauth_secret" | base64
```

**Cập nhật `ingress/ingress.yaml`:**
```yaml
- host: your-domain.com
  - host: your-domain.com
```

### 2. Build và Push Images

```bash
# Backend
cd ../backend
docker build -t your-registry/bicrypto-backend:latest .
docker push your-registry/bicrypto-backend:latest

# Frontend
cd ../frontend
docker build -t your-registry/bicrypto-frontend:latest .
docker push your-registry/bicrypto-frontend:latest
```

### 3. Cập nhật Image URLs

Trong các file deployment, thay `your-registry` bằng registry thực tế của bạn.

## 🚀 Deployment

### Tự động (khuyên dùng)
```bash
chmod +x deploy.sh
./deploy.sh
```

### Thủ công
```bash
# Áp dụng theo thứ tự
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f database/pvc.yaml
kubectl apply -f redis/pvc.yaml
kubectl apply -f database/deployment.yaml
kubectl apply -f redis/deployment.yaml
kubectl apply -f backend/deployment.yaml
kubectl apply -f frontend/deployment.yaml
kubectl apply -f ingress/ingress.yaml
```

## 🔍 Kiểm tra trạng thái

```bash
# Xem pods
kubectl get pods

# Xem services
kubectl get services

# Xem ingress
kubectl get ingress

# Logs
kubectl logs -f deployment/bicrypto-frontend
kubectl logs -f deployment/bicrypto-backend
```

## 🔄 Migration từ Docker sang K3s

### 1. Backup Database
```bash
# Từ container MySQL hiện tại
docker exec mysql-container mysqldump -u root -p v5 > backup.sql
```

### 2. Restore vào K3s MySQL
```bash
# Copy backup vào pod MySQL
kubectl cp backup.sql mysql-pod:/tmp/backup.sql

# Restore
kubectl exec mysql-pod -- mysql -u root -p v5 < /tmp/backup.sql
```

### 3. Cập nhật Environment Variables

Trong `.env` file của dự án, cập nhật:
```env
DB_HOST=mysql-service
REDIS_HOST=redis-service
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🌐 Truy cập ứng dụng

- **Frontend**: `https://your-domain.com`
- **Backend API**: `https://your-domain.com/api`
- **Admin Panel**: `https://your-domain.com/en/admin`

## 🔧 Troubleshooting

### Frontend không load được
```bash
kubectl logs -f deployment/bicrypto-frontend
kubectl describe pod bicrypto-frontend-xxxxx
```

### Backend lỗi kết nối database
```bash
kubectl logs -f deployment/bicrypto-backend
kubectl exec -it mysql-pod -- mysql -u root -p -e "SHOW DATABASES;"
```

### Ingress không hoạt động
```bash
kubectl get ingress
kubectl describe ingress bicrypto-ingress
```

## 📊 Monitoring

```bash
# Resource usage
kubectl top pods

# Events
kubectl get events --sort-by=.metadata.creationTimestamp

# Logs tất cả pods
kubectl logs -f -l app=bicrypto-frontend
kubectl logs -f -l app=bicrypto-backend
```

## 🔒 Security Notes

- Thay đổi tất cả passwords trong `secret.yaml`
- Sử dụng HTTPS với Let's Encrypt
- Cấu hình network policies
- Setup monitoring và logging
- Backup database regularly

## 🎯 Performance Tuning

- Tăng replicas cho high availability
- Cấu hình resource limits/requests
- Setup horizontal pod autoscaling
- Cấu hình Redis clustering nếu cần
- Database connection pooling

