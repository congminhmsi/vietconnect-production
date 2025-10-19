# Backend Dockerfile for K3s
FROM node:18-alpine AS builder


WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install git (needed for some npm packages)
RUN apk add --no-cache git

# Install dependencies
RUN npm install

# Copy module alias setup first
COPY module-alias-setup.ts ./

# Copy source code
COPY . .

# Build the application with esbuild (supports module aliases)
RUN npm install -g esbuild
RUN npx esbuild index.ts --bundle --platform=node --outfile=dist/index.js --external:@/* --external:@b/* --external:@db/* --format=cjs

# Production stage
FROM node:18-alpine AS production

# Add labels
LABEL maintainer="Bicrypto Team"
LABEL version="1.0"
LABEL description="Bicrypto Backend API"

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/config.js ./

# Create frontend/public directory structure for swagger
RUN mkdir -p ./frontend/public

# Copy swagger documentation from frontend if it exists
COPY ../frontend/public/swagger.json ./frontend/public/swagger.json 2>/dev/null || echo "Swagger file not found, will be generated at runtime"

# Install production dependencies only
RUN npm ci --only=production

# Install PM2 globally for production
RUN npm install -g pm2

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 4000

# Health check - check if server is listening on port 4000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const net=require('net');const c=new net.Socket();c.connect(4000,'localhost',()=>c.end());c.on('error',()=>process.exit(1))"

CMD ["npm", "run", "start"]

