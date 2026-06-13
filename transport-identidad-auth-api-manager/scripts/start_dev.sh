#!/usr/bin/env bash
# Start the FastAPI dev server with hot reload.
# Run from the project root: ./scripts/start_dev.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

exec .venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
