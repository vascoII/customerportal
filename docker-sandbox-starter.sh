#!/usr/bin/env bash

set -euo pipefail

echo "=== TECHEM Portail Client - Sandbox bootstrap ==="

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Backend env
ENV_BACKEND="./backend/.env"
ENV_BACKEND_EXAMPLE="./backend/.env.sandbox.example"

if [ ! -f "$ENV_BACKEND_EXAMPLE" ]; then
  echo "Erreur: fichier $ENV_BACKEND_EXAMPLE introuvable."
  echo "Veuillez créer un fichier backend/.env.sandbox.example."
  exit 1
fi

if [ -f "$ENV_BACKEND" ]; then
  echo "Backend: fichier .env déjà présent, aucune copie depuis .env.sandbox.example."
else
  echo "Backend: copie de $ENV_BACKEND_EXAMPLE vers $ENV_BACKEND..."
  cp "$ENV_BACKEND_EXAMPLE" "$ENV_BACKEND"
fi

# Frontend env
ENV_FRONTEND="./frontend/.env.local"
ENV_FRONTEND_EXAMPLE="./frontend/.env.local.sandbox.example"

if [ -f "$ENV_FRONTEND" ]; then
  echo "Frontend: fichier .env.local déjà présent, aucune copie depuis .env.local.sandbox.example."
else
  if [ -f "$ENV_FRONTEND_EXAMPLE" ]; then
    echo "Frontend: copie de $ENV_FRONTEND_EXAMPLE vers $ENV_FRONTEND..."
    cp "$ENV_FRONTEND_EXAMPLE" "$ENV_FRONTEND"
  else
    echo "Frontend: fichier $ENV_FRONTEND_EXAMPLE introuvable, copie ignorée."
  fi
fi

echo "Construction des conteneurs Docker (sans cache)..."
docker compose build --no-cache

echo "Démarrage des conteneurs en arrière-plan..."
docker compose up -d

echo "Sandbox démarrée."
echo "- Backend:   http://localhost:${BACKEND_PORT:-8000}"
echo "- Frontend:  http://localhost:${FRONTEND_PORT:-3000}"


