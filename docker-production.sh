#!/bin/bash

# Arrêter le script si une commande échoue
set -e

echo "📦 Installation des dépendances Symfony..."
composer install --no-dev --optimize-autoloader


echo "📂 Copie du dossier techemcore vers /public/bundles..."
mkdir -p public/bundles
cp -r public/techemcore public/bundles/

echo "🚀 Démarrage du serveur backend sur le port 8000 en mode production..."
php -S 127.0.0.1:8000 -t public &

echo "📦 Installation des dépendances frontend..."
cd frontend
npm install --production

echo "🌐 Build et démarrage du serveur frontend sur le port 3000 en mode production..."
npm run build
npm run start
