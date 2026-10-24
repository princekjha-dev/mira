#!/usr/bin/env bash
set -e

echo "=========================================================="
echo " Starting Mira V1 Local Development Environment"
echo "=========================================================="

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Start the project-local database before the API. The web app never receives
# the API's environment variables or credentials.
bash "$PROJECT_ROOT/scripts/ensure_postgres.sh"

# Stop both services when the script exits.
cleanup() {
  kill "$API_PID" "$WEB_PID" 2>/dev/null || true
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Start API
echo "--> Starting Rust Axum Core API on port 4000..."
(
  cd "$PROJECT_ROOT/apps/api"
  if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    . "$PROJECT_ROOT/.env"
    set +a
  fi
  DATABASE_URL="${DATABASE_URL:-postgres://postgres@127.0.0.1:5433/mira_dev}" cargo run
) &
API_PID=$!

# Wait for the API to become healthy before starting Vite. This also gives
# Cargo time to compile on the first run and reports startup/database failures.
echo "--> Waiting for API health check..."
for _ in {1..120}; do
  if curl --fail --silent http://127.0.0.1:4000/api/v1/health >/dev/null; then
    break
  fi
  if ! kill -0 "$API_PID" 2>/dev/null; then
    echo "ERROR: API exited before becoming healthy. Check the database is running on port 5433."
    wait "$API_PID" || true
    exit 1
  fi
  sleep 1
done

if ! curl --fail --silent http://127.0.0.1:4000/api/v1/health >/dev/null; then
  echo "ERROR: API did not become healthy within 120 seconds. Check the database and API logs."
  exit 1
fi

# Start Web
echo "--> Starting React Vite Web Frontend on port 5173..."
(cd apps/web && npm run dev) &
WEB_PID=$!

echo "=========================================================="
echo " Mira is live:"
echo " - Frontend: http://localhost:5173"
echo " - API:      http://localhost:4000"
echo " Press Ctrl+C to terminate."
echo "=========================================================="

wait
