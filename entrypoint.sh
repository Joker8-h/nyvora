#!/bin/sh
set -e

echo "🔄 Running Prisma DB push..."
cd /app/packages/database
npx prisma db push --accept-data-loss --skip-generate 2>&1 || echo "⚠️ DB push failed, continuing anyway..."
cd /app

echo "🚀 Starting API..."
exec node apps/api/dist/main.js
