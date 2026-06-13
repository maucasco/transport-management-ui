#!/usr/bin/env bash
# Elimina y recrea el schema completo: migraciones + seed.
# Uso: ./scripts/recreate_db.sh
# Requiere: docker compose up -d db && .venv activo

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "[recreate_db] Dropping all tables via alembic downgrade..."
"$PROJECT_DIR/.venv/bin/alembic" -c "$PROJECT_DIR/alembic.ini" downgrade base

echo "[recreate_db] Applying all migrations..."
"$PROJECT_DIR/.venv/bin/alembic" -c "$PROJECT_DIR/alembic.ini" upgrade head

echo "[recreate_db] Loading seed data..."
docker compose -f "$(dirname "$PROJECT_DIR")/docker-compose.yml" exec -T db \
  psql --username=transport_user --dbname=transport_auth \
  < "$SCRIPT_DIR/seed.sql"

echo "[recreate_db] Done. Users seeded:"
echo "  admin@empresa.com     / admin123  (role: admin,     active: true)"
echo "  conductor@empresa.com / admin123  (role: conductor, active: true)"
echo "  inactive@empresa.com  / admin123  (role: conductor, active: false)"
