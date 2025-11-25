#!/bin/bash
set -euo pipefail

ENV_FILE=".env.demo"
ENV_LABEL="demo"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Missing $ENV_FILE. Create it from .env.demo.example."
  exit 1
fi

COMPOSE_FILES=("-f" "compose.yaml")
if [ -f "compose.override.yaml" ]; then
  COMPOSE_FILES+=("-f" "compose.override.yaml")
fi

COMMAND="${1:-up}"
if [ $# -gt 0 ]; then
  shift
fi

echo "🚀 Starting Docker stack ($ENV_LABEL) using $ENV_FILE"
exec docker compose "${COMPOSE_FILES[@]}" --env-file "$ENV_FILE" "$COMMAND" "$@"
