# 🎯 Prochaines Étapes - Migration Frontend

## 📊 État actuel

✅ **Fait** :
- Dossier renommé en `frontend`
- `package.json` configuré
- Dépendances de base installées (Next.js, React, Tailwind)
- Structure TailAdmin en place
- `.env.local` créé

❌ **À faire** :
- Installer les dépendances essentielles
- Créer la structure `src/lib/`
- Configurer React Query
- Créer le client API
- Configurer l'authentification

---

## 🚀 Étape 1 : Installer les dépendances manquantes

### Commande à exécuter

```bash
cd frontend
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand
npm install react-hook-form zod @hookform/resolvers
npm install next-intl
npm install axios
npm install date-fns
```

### Vérification

```bash
npm list @tanstack/react-query axios zustand react-hook-form zod next-intl
```

**Temps estimé** : 2-3 minutes

---

## 📁 Étape 2 : Créer la structure de base

### Dossiers à créer

```bash
cd frontend/src
mkdir -p lib/api
mkdir -p lib/hooks
mkdir -p lib/utils
mkdir -p lib/types
mkdir -p i18n
```

### Structure cible

```
src/
├── lib/
│   ├── api/              # Clients API
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilitaires
│   └── types/            # Types TypeScript
└── i18n/                 # Configuration i18n
```

**Temps estimé** : 1 minute

---

## ⚙️ Étape 3 : Configurer le client API

### Créer `src/lib/api/client.ts`

Créer le client Axios configuré pour communiquer avec l'API Symfony.

**Fonctionnalités** :
- Base URL depuis `.env.local`
- Gestion des cookies (session)
- Intercepteurs pour erreurs
- Headers par défaut

**Temps estimé** : 15-20 minutes

---

## 🔄 Étape 4 : Configurer React Query

### Créer `src/app/providers.tsx`

Provider React Query pour wrapper l'application.

**Fonctionnalités** :
- QueryClient configuré
- DevTools en développement
- Gestion des erreurs globales

### Modifier `src/app/layout.tsx`

Ajouter le `QueryClientProvider` dans le layout racine.

**Temps estimé** : 10-15 minutes

---

## 🔐 Étape 5 : Configurer l'authentification

### Créer `src/lib/hooks/useAuth.ts`

Hook personnalisé pour gérer l'authentification.

**Fonctionnalités** :
- État utilisateur (Zustand)
- Fonction login
- Fonction logout
- Vérification de session

### Créer `src/lib/store/authStore.ts`

Store Zustand pour l'état d'authentification.

**Temps estimé** : 20-30 minutes

---

## 🌐 Étape 6 : Configurer next-intl

### Créer `src/i18n/request.ts`

Configuration next-intl pour la gestion multilingue (FR/EN).

### Modifier `src/middleware.ts`

Ajouter la gestion des locales.

**Temps estimé** : 15-20 minutes

---

## 🛡️ Étape 7 : Créer le middleware d'authentification

### Modifier `src/middleware.ts`

Middleware Next.js pour :
- Vérifier l'authentification
- Rediriger vers `/login` si non authentifié
- Gérer les rôles (ROLE_OCCUPANT, ROLE_GESTIONNAIRE)

**Temps estimé** : 20-30 minutes

---

## 📝 Étape 8 : Créer les types TypeScript

### Créer `src/lib/types/api.ts`

Types pour les réponses API :
- User
- Building (Immeuble)
- Housing (Logement)
- Intervention
- Ticket
- etc.

**Temps estimé** : 30-40 minutes

---

## 🧪 Étape 9 : Adapter le formulaire de connexion

### Modifier `src/components/auth/SignInForm.tsx`

Adapter pour :
- Utiliser React Hook Form
- Appeler l'API `/api/security/login`
- Gérer les erreurs
- Rediriger après connexion

**Temps estimé** : 30-40 minutes

---

## ✅ Étape 10 : Tester le setup

### Commandes de test

```bash
# Démarrer le serveur de développement
cd frontend
npm run dev

# Dans un autre terminal, tester l'API
curl -X POST http://localhost:8000/api/security/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' \
  -c cookies.txt
```

### Checklist de validation

- [ ] Application démarre sans erreur
- [ ] Page de login s'affiche
- [ ] Connexion fonctionne
- [ ] Redirection après connexion
- [ ] Session persistée
- [ ] Appels API fonctionnent

**Temps estimé** : 15-20 minutes

---

## 📋 Ordre d'exécution recommandé

### Phase 1 : Setup de base (1-2 heures)

1. ✅ Installer les dépendances (Étape 1)
2. ✅ Créer la structure (Étape 2)
3. ✅ Configurer le client API (Étape 3)
4. ✅ Configurer React Query (Étape 4)

### Phase 2 : Authentification (1-2 heures)

5. ✅ Configurer l'authentification (Étape 5)
6. ✅ Créer le middleware (Étape 7)
7. ✅ Adapter le formulaire de connexion (Étape 9)

### Phase 3 : Configuration avancée (1 heure)

8. ✅ Configurer next-intl (Étape 6)
9. ✅ Créer les types TypeScript (Étape 8)

### Phase 4 : Tests (30 minutes)

10. ✅ Tester le setup (Étape 10)

---

## 🎯 Objectif de cette session

**Compléter les Étapes 1 à 4** pour avoir :
- ✅ Toutes les dépendances installées
- ✅ Structure de base créée
- ✅ Client API fonctionnel
- ✅ React Query configuré

**Temps total estimé** : 1-2 heures

---

## 📚 Ressources

- [Documentation React Query](https://tanstack.com/query/latest)
- [Documentation Zustand](https://zustand-demo.pmnd.rs/)
- [Documentation React Hook Form](https://react-hook-form.com/)
- [Documentation next-intl](https://next-intl-docs.vercel.app/)
- [API Documentation](./API_DOCUMENTATION.md)
- [Frontend Migration Strategy](./FRONTEND_MIGRATION_STRATEGY.md)

---

## ⚠️ Points d'attention

### 1. Variables d'environnement

Vérifier que `.env.local` contient :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. CORS

S'assurer que l'API Symfony accepte les requêtes depuis `http://localhost:3000`.

### 3. Cookies de session

Le client API doit envoyer les cookies avec `withCredentials: true`.

### 4. Types TypeScript

Créer les types au fur et à mesure pour éviter les erreurs.

---

**Dernière mise à jour** : 2025-01-XX  
**Prochaine étape immédiate** : Installer les dépendances (Étape 1)

