# Frontend Dockerfile for K3s
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and config
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY next.config.js ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Add labels
LABEL maintainer="Bicrypto Team"
LABEL version="1.0"
LABEL description="Bicrypto Frontend Production"

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/middleware.ts ./
COPY --from=builder /app/next-env.d.ts ./
COPY --from=builder /app/tsconfig.json ./

# Install production dependencies only
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# Health check - check if server is listening on port 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const net=require('net');const c=new net.Socket();c.connect(3000,'localhost',()=>c.end());c.on('error',()=>process.exit(1))"

CMD ["npm", "run", "start"]

