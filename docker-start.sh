#!/bin/sh
# docker-start.sh

echo "Starting Hospital Scanner Boot Sequence..."

# Wait for the database to be ready
echo "Waiting for PostgreSQL to be ready on db:5432..."
until nc -z db 5432; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is up - initializing schema..."

# Push the schema (creates tables if they don't exist)
npx prisma db push --accept-data-loss --skip-generate

# Seed the database
echo "Seeding initial organ data..."
npx prisma db seed

echo "Boot sequence complete. Launching Hospital Scanner..."

# Start the application
exec node server.js
