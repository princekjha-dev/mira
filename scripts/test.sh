#!/usr/bin/env bash
set -e

echo "=========================================================="
echo " Running Mira V3 Scheme, Benefit & Eligibility Test Suite"
echo "=========================================================="

# 1. Backend tests
echo ""
cd apps/api
DATABASE_URL="${DATABASE_URL:-postgres://postgres:postgrespassword@127.0.0.1:5433/mira_test}" cargo test -- --nocapture
cd ../..

# 2. Frontend tests
echo ""
echo "--> [2/2] Running Frontend Vitest Unit Tests..."
cd apps/web
npm test
cd ../..

echo ""
echo "=========================================================="
echo " ✅ All Mira V1, V2, and V3 tests passed successfully!"
echo "=========================================================="
