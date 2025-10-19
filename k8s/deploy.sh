#!/bin/bash

# Script deploy Bicrypto lên K3s
# Chạy trên máy local sau khi build images

set -e

echo "🚀 Deploying Bicrypto to K3s..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is configured for K3s
if ! kubectl cluster-info >/dev/null 2>&1; then
    print_error "kubectl not configured for K3s cluster"
    print_error "Please configure kubectl to connect to your K3s cluster"
    exit 1
fi

# Build and push images (thay bằng registry của bạn)
print_status "Building backend image..."
docker build -t your-registry/bicrypto-backend:latest ../backend
docker push your-registry/bicrypto-backend:latest

print_status "Building frontend image..."
docker build -t your-registry/bicrypto-frontend:latest ../frontend
docker push your-registry/bicrypto-frontend:latest

# Deploy to K3s
print_status "Deploying to K3s cluster..."

# Apply manifests in order
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Storage
kubectl apply -f database/pvc.yaml
kubectl apply -f redis/pvc.yaml

# Database and Redis
kubectl apply -f database/deployment.yaml
kubectl apply -f redis/deployment.yaml

# Wait for database and redis to be ready
print_status "Waiting for database and Redis to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mysql
kubectl wait --for=condition=available --timeout=300s deployment/redis

# Backend
kubectl apply -f backend/deployment.yaml

# Wait for backend to be ready
print_status "Waiting for backend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/bicrypto-backend

# Frontend
kubectl apply -f frontend/deployment.yaml

# Wait for frontend to be ready
print_status "Waiting for frontend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/bicrypto-frontend

# Ingress
kubectl apply -f ingress/ingress.yaml

print_status "🎉 Deployment completed successfully!"
print_status "Frontend URL: https://your-domain.com"
print_status "Backend API: https://your-domain.com/api"

# Show status
kubectl get pods
kubectl get services
kubectl get ingress

