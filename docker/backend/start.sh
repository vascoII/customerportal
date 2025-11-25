#!/bin/bash
set -euo pipefail

APP_DIR="${APP_HOME:-/app}"
PORT="${BACKEND_PORT:-8000}"
COMPOSER_FLAGS="${COMPOSER_INSTALL_FLAGS:---no-interaction --prefer-dist}"

cd "$APP_DIR"

if [ ! -d vendor ] || [ -z "$(ls -A vendor 2>/dev/null || true)" ]; then
  echo "📦 Installing PHP dependencies ($COMPOSER_FLAGS)"
  composer install $COMPOSER_FLAGS
fi

mkdir -p public/bundles
if [ -d public/techemcore ]; then
  cp -a public/techemcore/. public/bundles/
fi

export APP_ENV="${APP_ENV:-dev}"
export APP_DEBUG="${APP_DEBUG:-1}"

exec php -S 0.0.0.0:${PORT} -t public public/index.php
