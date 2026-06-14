#!/bin/bash
set -e

# Run database migrations and seed
cd /app/backend
php artisan migrate --seed --force

# Start Node.js server (frontend SSR + API proxy)
cd /app
exec node start.mjs
