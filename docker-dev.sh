#!/bin/bash

# Arrêter le script si une commande échoue
set -e

echo "📦 Installation des dépendances Symfony..."
composer install

echo "🚀 Démarrage du serveur backend sur le port 8000 en mode développement..."
php -S 127.0.0.1:8000 -t public &

echo "📦 Installation des dépendances frontend..."
cd frontend
npm install

echo "🌐 Démarrage du serveur frontend sur le port 3000 en mode développement..."

npm run dev