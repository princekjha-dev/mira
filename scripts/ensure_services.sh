#!/usr/bin/env bash
set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

bash "$PROJECT_ROOT/scripts/ensure_postgres.sh"

if [ "${1:-}" = "--database-only" ]; then
  exit 0
fi

# 2. Check Mira API on Port 4000
if ! curl --fail --silent http://127.0.0.1:4000/api/v1/health >/dev/null 2>&1; then
  echo "--> Starting Mira Backend API on port 4000..."
  if [ -f "$PROJECT_ROOT/apps/api/target/debug/mira-api" ]; then
    (
      cd "$PROJECT_ROOT/apps/api"
      if [ -f "$PROJECT_ROOT/.env" ]; then
        set -a
        . "$PROJECT_ROOT/.env"
        set +a
      fi
      export DATABASE_URL="${DATABASE_URL:-postgres://postgres@127.0.0.1:5433/mira_dev}"
      exec "$PROJECT_ROOT/apps/api/target/debug/mira-api" >/tmp/mira-api.log 2>&1 &
    )
  else
    (
      cd "$PROJECT_ROOT/apps/api"
      if [ -f "$PROJECT_ROOT/.env" ]; then
        set -a
        . "$PROJECT_ROOT/.env"
        set +a
      fi
      export DATABASE_URL="${DATABASE_URL:-postgres://postgres@127.0.0.1:5433/mira_dev}"
      exec cargo run >/tmp/mira-api.log 2>&1 &
    )
  fi

  for _ in {1..30}; do
    if curl --fail --silent http://127.0.0.1:4000/api/v1/health >/dev/null 2>&1; then
      echo "--> Mira API is healthy and listening on port 4000."
      break
    fi
    sleep 0.5
  done

  if ! curl --fail --silent http://127.0.0.1:4000/api/v1/health >/dev/null 2>&1; then
    echo "ERROR: Mira API did not become healthy. Check /tmp/mira-api.log." >&2
    exit 1
  fi
fi
