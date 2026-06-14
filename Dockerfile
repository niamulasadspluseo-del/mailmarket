# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Get composer binary
FROM composer:latest AS composer

# Stage 3: Final runtime (Debian-based PHP)
FROM php:8.3-cli
WORKDIR /app

# Install system packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libpq-dev \
    libonig-dev \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pdo_mysql mbstring

# Install Node.js (official binary)
RUN curl -fsSL https://nodejs.org/dist/v22.14.0/node-v22.14.0-linux-x64.tar.xz \
    | tar -xJ -C /usr/local --strip-components=1

# Install composer
COPY --from=composer /usr/bin/composer /usr/bin/composer

# Copy backend source
COPY backend/ backend/

# Copy frontend build from stage 1
COPY --from=frontend-build /app/dist/ dist/
COPY --from=frontend-build /app/start.mjs ./start.mjs

# Install backend dependencies
RUN cd backend && composer install --no-dev --optimize-autoloader

# Laravel storage setup
RUN cd backend && \
    mkdir -p storage/framework/cache/data storage/framework/views storage/logs && \
    chmod -R 777 storage bootstrap/cache

# Copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PORT=${PORT:-3000}
EXPOSE $PORT

CMD ["/entrypoint.sh"]
