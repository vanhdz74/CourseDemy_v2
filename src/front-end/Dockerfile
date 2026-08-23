# Stage 1: Cài đặt dependencies (thư viện) cho project Node.js
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Copy package.json và lockfile để cài đặt thư viện trước để tận dụng cache
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json

RUN npm ci

# Stage 2: Build code ứng dụng Next.js
FROM deps AS builder
WORKDIR /app
COPY . .

# Khai báo các tham số build (có thể truyền qua docker-compose args)
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ARG NEXT_PUBLIC_GEMINI_API_KEY=
ARG NEXT_PUBLIC_WEATHER_API_KEY=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GEMINI_API_KEY=$NEXT_PUBLIC_GEMINI_API_KEY
ENV NEXT_PUBLIC_WEATHER_API_KEY=$NEXT_PUBLIC_WEATHER_API_KEY

# Chạy build code cho web app
RUN npm run build -w @coursedemy/web

# Stage 3: Tạo runtime image nhẹ để chạy trong môi trường production
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy các thư viện và code đã build từ builder sang runner
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web

EXPOSE 3000

# Khởi chạy Next.js app ở port 3000
CMD ["npm", "run", "start", "-w", "@coursedemy/web"]
