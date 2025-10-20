# VIETCONNECT SOLUTIONS - Production Deployment Guide

## 🏢 Company Information
- **Company Name**: CÔNG TY CỔ PHẦN VIETCONNECT SOLUTIONS
- **Business License**: 0319207023
- **Registration Date**: 2025-10-09
- **Legal Representative**: LÊ TRUNG PHONG (Tổng giám đốc)
- **Address**: Tầng 6, Tòa nhà Mê Linh Point, Số 2 đường Ngô Đức Kế, Phường Sài Gòn, TP.HCM, Việt Nam
- **Phone**: 0944999618
- **Email**: Vietconnectsolutions@gmail.com

## 🚀 Complete Deployment Instructions

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ 
- pnpm
- PM2

### 1. Database Setup
```bash
# Start MySQL container
docker run -d --name mysql-bicrypto \
  -e MYSQL_ROOT_PASSWORD= \
  -e MYSQL_DATABASE=bicrypto \
  -p 3306:3306 \
  mysql:8.0

# Restore database from backup
docker exec -i mysql-bicrypto mysql -u root < database_full_backup.sql
```

### 2. Redis Setup
```bash
# Start Redis container
docker run -d --name redis-bicrypto \
  -p 6379:6379 \
  redis:7-alpine

# Restore Redis data
docker cp redis_full_backup.rdb redis-bicrypto:/data/dump.rdb
docker restart redis-bicrypto
```

### 3. Environment Configuration
```bash
# Copy environment files
cp .env.example .env
cp docker.env.example docker.env

# Update with your settings:
# - Database credentials
# - Redis credentials  
# - Binance API keys
# - Email settings
```

### 4. Backend Setup
```bash
cd backend
pnpm install
pnpm build
```

### 5. Frontend Setup
```bash
cd frontend
pnpm install
pnpm build
```

### 6. Start Services
```bash
# Using PM2 (Production)
pnpm start

# Or manually
pm2 start production.config.js --env production
```

### 7. Verify Deployment
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs/v1

## 📊 Data Included
- ✅ Complete MySQL database with all tables and data
- ✅ Redis cache with market tickers and settings
- ✅ All company information updated to VIETCONNECT SOLUTIONS
- ✅ Market data populated from Binance API
- ✅ Mobile app download section enabled
- ✅ All branding updated from Bicrypto to VIETCONNECT SOLUTIONS

## 🔧 Maintenance Scripts
- `update-company-info.js` - Update company information in database
- `populate-ticker-fixed.js` - Refresh market data from Binance
- `clear-settings-cache.js` - Clear Redis settings cache

## 📱 Features Included
- ✅ Spot Trading
- ✅ Binary Options
- ✅ Market Data (Real-time from Binance)
- ✅ KYC System
- ✅ User Management
- ✅ Admin Panel
- ✅ Mobile App Download Section
- ✅ Blog System
- ✅ Support System
- ✅ P2P Trading
- ✅ Staking
- ✅ NFT Marketplace
- ✅ ICO Platform

## 🛡️ Security Features
- Multi-layer authentication
- KYC verification system
- Secure wallet management
- Encrypted data storage
- Rate limiting
- CSRF protection

---
**Deployment Date**: $(date)
**Version**: Production Ready
**Status**: ✅ 100% Complete
