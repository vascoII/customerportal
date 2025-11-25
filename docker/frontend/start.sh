#!/bin/bash
set -euo pipefail

APP_DIR="${APP_HOME:-/app}"
FRONT_DIR="$APP_DIR/frontend"
PORT="${FRONTEND_PORT:-3000}"
NODE_ENVIRONMENT="${NODE_ENV:-development}"

cd "$FRONT_DIR"

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null || true)" ]; then
  echo "📦 Installing frontend dependencies"
  npm install
fi

export PORT="$PORT"
export HOST=0.0.0.0

if [ "$NODE_ENVIRONMENT" = "production" ]; then
  npm run build
  exec npm run start
else
  export CHOKIDAR_USEPOLLING="${CHOKIDAR_USEPOLLING:-true}"
  exec npm run dev
fi
