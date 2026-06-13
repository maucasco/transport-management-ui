#!/usr/bin/env bash
# Run the full test suite (unit + integration).
# Requires PostgreSQL running via: docker compose up -d db
# Run from the project root: ./scripts/run_tests.sh [pytest-args...]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

exec .venv/bin/pytest "$@"
