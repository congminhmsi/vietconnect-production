# ==========================================
# VIETCONNECT SOLUTIONS - Backend Dockerfile
# SIMPLIFIED - Copy pre-built dist folder
# ==========================================

FROM node:18-alpine

LABEL maintainer="VIETCONNECT SOLUTIONS"
LABEL version="1.0"
LABEL description="VIETCONNECT SOLUTIONS Backend API - Production"

# Install glibc and build tools for uWebSockets.js compatibility
RUN apk add --no-cache libc6-compat python3 make g++ git

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

WORKDIR /app

# Install runtime dependencies (without uWebSockets.js for now)
RUN npm install ajv ajv-formats pm2 dotenv module-alias --silent

# Copy uWebSockets.js from local build
RUN mkdir -p node_modules/uWebSockets.js && \
    echo "Copying uWebSockets.js from local build..."

# Copy built application (from local build)
COPY dist/ ./dist/

# Copy environment file
COPY .env ./

# Create logs directory
RUN mkdir -p /app/logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 4000

# Set environment variables
ENV PORT 4000
ENV NODE_ENV production

# No health check - app may fail to start due to missing uWebSockets.js

# Start the application
CMD ["node", "dist/index.js"]