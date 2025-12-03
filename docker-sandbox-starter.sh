#!/usr/bin/env bash

set -euo pipefail

echo "=== TECHEM Portail Client - Sandbox bootstrap ==="

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

ENV_FILE=".env"
ENV_EXAMPLE="./.env.sandbox.example"

if [ ! -f "$ENV_EXAMPLE" ]; then
  echo "Erreur: fichier $ENV_EXAMPLE introuvable."
  echo "Veuillez créer un fichier env.sandbox.example à la racine du projet."
  exit 1
fi

if [ -f "$ENV_FILE" ]; then
  echo "Fichier .env déjà présent, aucune copie depuis env.sandbox.example."
else
  echo "Copie de $ENV_EXAMPLE vers $ENV_FILE..."
  cp "$ENV_EXAMPLE" "$ENV_FILE"
fi

echo "Construction des conteneurs Docker (sans cache)..."
docker compose build --no-cache

echo "Démarrage des conteneurs en arrière-plan..."
docker compose up -d

echo "Sandbox démarrée."
echo "- Backend:   http://localhost:${BACKEND_PORT:-8000}"
echo "- Frontend:  http://localhost:${FRONTEND_PORT:-3000}"


