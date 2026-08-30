#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push

echo "Seeding database..."
npx prisma db seed || echo "Seed already populated or completed"

echo "Starting application..."
exec node server.js
