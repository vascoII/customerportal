#!/bin/bash

# Script de test rapide pour le setup Frontend
# Usage: ./test-setup.sh

set -e

echo "🧪 Tests du setup Frontend Techem Customer Portal"
echo "=================================================="
echo ""

# Couleurs pour l'output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
PASSED=0
FAILED=0

# Fonction pour afficher un succès
success() {
  echo -e "${GREEN}✅ $1${NC}"
  ((PASSED++))
}

# Fonction pour afficher une erreur
error() {
  echo -e "${RED}❌ $1${NC}"
  ((FAILED++))
}

# Fonction pour afficher un avertissement
warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "📁 Test 1: Vérification des fichiers essentiels"
echo "-----------------------------------------------"

FILES=(
  "src/lib/api/client.ts"
  "src/lib/types/api.ts"
  "src/lib/hooks/useAuth.ts"
  "src/lib/store/authStore.ts"
  "src/middleware.ts"
  "src/app/providers.tsx"
  "src/components/auth/SignInForm.tsx"
  "package.json"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    success "$file existe"
  else
    error "$file manquant"
  fi
done

echo ""
echo "📦 Test 2: Vérification des dépendances"
echo "---------------------------------------"

if [ -f "package.json" ]; then
  # Vérifier que node_modules existe
  if [ -d "node_modules" ]; then
    success "node_modules existe"
  else
    error "node_modules manquant - Exécutez 'npm install'"
  fi

  # Vérifier les dépendances critiques
  CRITICAL_DEPS=(
    "@tanstack/react-query"
    "zustand"
    "react-hook-form"
    "zod"
    "axios"
    "next"
    "react"
  )

  for dep in "${CRITICAL_DEPS[@]}"; do
    if npm list "$dep" > /dev/null 2>&1; then
      success "$dep installé"
    else
      error "$dep manquant"
    fi
  done
else
  error "package.json introuvable"
fi

echo ""
echo "🔧 Test 3: Vérification de la configuration"
echo "-------------------------------------------"

# Vérifier next.config.ts
if [ -f "next.config.ts" ]; then
  success "next.config.ts existe"
else
  error "next.config.ts manquant"
fi

# Vérifier .env.local (peut ne pas exister, c'est OK)
if [ -f ".env.local" ]; then
  success ".env.local existe"
  # Vérifier les variables essentielles
  if grep -q "NEXT_PUBLIC_API_URL" .env.local; then
    success "NEXT_PUBLIC_API_URL configuré"
  else
    warning "NEXT_PUBLIC_API_URL non trouvé dans .env.local"
  fi
else
  warning ".env.local n'existe pas - Créez-le avec NEXT_PUBLIC_API_URL"
fi

echo ""
echo "📝 Test 4: Vérification TypeScript"
echo "----------------------------------"

if command -v npx > /dev/null 2>&1; then
  if npx tsc --noEmit --skipLibCheck 2>&1 | grep -q "error"; then
    error "Erreurs TypeScript détectées"
    npx tsc --noEmit --skipLibCheck 2>&1 | grep "error" | head -5
  else
    success "Aucune erreur TypeScript"
  fi
else
  warning "npx non disponible - Impossible de vérifier TypeScript"
fi

echo ""
echo "📊 Résumé"
echo "========="
echo -e "${GREEN}✅ Tests réussis: $PASSED${NC}"
echo -e "${RED}❌ Tests échoués: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 Tous les tests sont passés !${NC}"
  echo ""
  echo "Prochaines étapes:"
  echo "1. Vérifiez que le backend Symfony est démarré sur http://localhost:8000"
  echo "2. Exécutez 'npm run dev' pour démarrer le serveur de développement"
  echo "3. Ouvrez http://localhost:3000/signin dans votre navigateur"
  echo "4. Consultez TESTING_GUIDE.md pour les tests complets"
  exit 0
else
  echo -e "${RED}⚠️  Certains tests ont échoué. Veuillez corriger les erreurs avant de continuer.${NC}"
  exit 1
fi

