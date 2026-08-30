#!/bin/sh

echo "Running database migrations..."
npx prisma db push 2>&1 || echo "Migration warning: schema may already be up to date"

echo "Seeding database..."
npx prisma db seed 2>&1 || echo "Seed skipped: database may already be populated"

echo "Starting application..."
node server.js
