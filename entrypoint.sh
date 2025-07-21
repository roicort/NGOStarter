#!/bin/sh

# Wait for Postgres to be ready before continuing

host="$POSTGRES_HOST"
port="$POSTGRES_PORT"

if [ -z "$host" ]; then
  host="postgres"
fi
if [ -z "$port" ]; then
  port=5432
fi

until nc -z "$host" "$port"; do
  echo "Waiting for Postgres at $host:$port..."
  sleep 1
done

echo "Postgres is ready."

if [ "$DISABLE_MIGRATIONS" = "True" ] || [ "$DISABLE_MIGRATIONS" = "true" ]; then
  echo "Migrations are disabled. Skipping..."
  exec "$@"
else
  echo "Running migrations and static generation..."
  pnpm payload migrate:create && pnpm payload migrate && HOSTNAME="0.0.0.0" pnpm run build:docker:generate
  exec "$@"
fi