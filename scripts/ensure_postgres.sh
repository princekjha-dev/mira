#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PG_PORT="${MIRA_PG_PORT:-5433}"

if pg_isready -h 127.0.0.1 -p "$PG_PORT" >/dev/null 2>&1; then
  exit 0
fi

PG_CTL="$(command -v pg_ctl || true)"
if [ -z "$PG_CTL" ] && [ -x /usr/lib/postgresql/18/bin/pg_ctl ]; then
  PG_CTL=/usr/lib/postgresql/18/bin/pg_ctl
fi

if [ -d "$PROJECT_ROOT/.pgdata" ] && [ -n "$PG_CTL" ]; then
  echo "--> Starting the local Mira PostgreSQL database on port $PG_PORT..."
  "$PG_CTL" \
    -D "$PROJECT_ROOT/.pgdata" \
    -o "-p $PG_PORT -k $PROJECT_ROOT/.pgdata" \
    -l "$PROJECT_ROOT/.pgdata/logfile" \
    -w start
elif command -v docker >/dev/null 2>&1 && [ -f "$PROJECT_ROOT/docker-compose.yml" ]; then
  echo "--> Starting the Mira PostgreSQL service with Docker Compose..."
  (cd "$PROJECT_ROOT" && docker compose up -d postgres)
else
  echo "ERROR: Local PostgreSQL is unavailable and no configured database service can be started." >&2
  exit 1
fi

for _ in {1..60}; do
  if pg_isready -h 127.0.0.1 -p "$PG_PORT" >/dev/null 2>&1; then
    echo "--> Mira PostgreSQL is ready on port $PG_PORT."
    exit 0
  fi
  sleep 1
done

echo "ERROR: Mira PostgreSQL did not become ready on port $PG_PORT." >&2
exit 1
