#!/usr/bin/env bash
set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 1. Check PostgreSQL on Port 5433
if ! pg_isready -h 127.0.0.1 -p 5433 >/dev/null 2>&1; then
  echo "--> Starting Mira PostgreSQL on port 5433..."
  if [ -d "$PROJECT_ROOT/.pgdata" ]; then
    /usr/lib/postgresql/18/bin/pg_ctl -D "$PROJECT_ROOT/.pgdata" -o "-p 5433 -k $PROJECT_ROOT/.pgdata" -l "$PROJECT_ROOT/.pgdata/logfile" start || true
  fi
  sleep 1
fi

# 2. Check Mira API on Port 4000
if ! curl --fail --silent http://127.0.0.1:4000/api/v1/health >/dev/null 2>&1; then
  echo "--> Starting Mira Backend API on port 4000..."
  if [ -f "$PROJECT_ROOT/apps/api/target/debug/mira-api" ]; then
    (
      cd "$PROJECT_ROOT/apps/api"
      env $(cat "$PROJECT_ROOT/.env" | xargs) "$PROJECT_ROOT/apps/api/target/debug/mira-api" >/tmp/mira-api.log 2>&1 &
    )
  else
    (
      cd "$PROJECT_ROOT/apps/api"
      env $(cat "$PROJECT_ROOT/.env" | xargs) cargo run >/tmp/mira-api.log 2>&1 &
    )
  fi

  for _ in {1..30}; do
    if curl --fail --silent http://127.0.0.1:4000/api/v1/health >/dev/null 2>&1; then
      echo "--> Mira API is healthy and listening on port 4000."
      break
    fi
    sleep 0.5
  done
fi
