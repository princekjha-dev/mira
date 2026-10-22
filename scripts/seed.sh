#!/usr/bin/env bash
set -e

echo "--> Seeding Mira database with synthetic demo data..."
cd apps/api
DATABASE_URL="postgres://postgres@127.0.0.1:5433/mira_dev" cargo run -- seed
cd ../..
echo "--> Database seeded successfully."
