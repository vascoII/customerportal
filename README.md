# Project Setup Guide - TECHEM Customer Portal

Ce guide explique comment lancer le projet en local, soit en mode classique, soit via la sandbox Docker.

---

## 1. Cloner le dépôt

```bash
git clone <this-repo-url>
cd customerportal
```

---

## 2. Lancer la sandbox Docker (recommandé pour la branche `sandbox`)

Depuis la racine du projet :

```bash
git checkout sandbox
./docker-sandbox-starter.sh
```

Le script va :

- Copier `env.sandbox.example` vers `.env` si `.env` n’existe pas encore
- Construire les conteneurs **sans cache** :
  ```bash
  docker compose build --no-cache
  ```
- Démarrer les conteneurs en arrière-plan :
  ```bash
  docker compose up -d
  ```

Par défaut, les services seront disponibles sur :

- Backend : `http://localhost:${BACKEND_PORT:-8000}`
- Frontend : `http://localhost:${FRONTEND_PORT:-3000}`

Tu peux ajuster les ports via les variables `BACKEND_PORT` et `FRONTEND_PORT` dans le fichier `.env`.

---

## 3. Installation manuelle (sans Docker) – optionnel

Si tu préfères lancer le projet sans Docker, voici les grandes étapes.

### 3.1. Vérifier les prérequis Symfony

Si tu as Symfony CLI installé :

```bash
symfony check:requirements
```

### 3.2. Configuration d’environnement

Copier le fichier d’exemple et ajuster les valeurs :

```bash
cp .env.example .env
```

Compléter les variables nécessaires dans `.env`.

### 3.3. Installer les dépendances backend

```bash
composer install
```

### 3.4. Installer les dépendances frontend

```bash
cd frontend
npm install
```

Lancer le frontend en dev :

```bash
npm run dev
```

### 3.5. Lancer le serveur Symfony

Depuis la racine backend (ou projet si Symfony CLI configuré) :

```bash
symfony server:start
```

L’application backend sera disponible par défaut sur `https://127.0.0.1:8000`.
