# Stratégie de Migration Frontend - React + Tailwind CSS + Next.js

## 📋 Vue d'ensemble

Ce document décrit la stratégie de migration du frontend actuel (Twig + Bootstrap + jQuery) vers une stack moderne : **React**, **Tailwind CSS** et **Next.js**.

**Objectif** : Créer une application frontend moderne, performante et maintenable qui consomme l'API REST existante.

---

## 🎯 Objectifs de la migration

### Objectifs techniques
- ✅ Moderniser la stack technologique
- ✅ Améliorer les performances (SSR, code splitting)
- ✅ Faciliter la maintenance (composants réutilisables)
- ✅ Améliorer l'expérience développeur (TypeScript, hot reload)
- ✅ Optimiser le SEO (SSR/SSG avec Next.js)
- ✅ Améliorer l'accessibilité

### Objectifs fonctionnels
- ✅ Conserver toutes les fonctionnalités existantes
- ✅ Améliorer l'UX (transitions, animations)
- ✅ Responsive design optimisé
- ✅ Support multilingue (FR/EN)
- ✅ Gestion des rôles et permissions

---

## 🏗️ Architecture cible

### Stack technique

```
Next.js 14+ (App Router)
├── React 18+
├── TypeScript 5+
├── Tailwind CSS 3+
├── React Query (TanStack Query)
├── Zustand (State Management)
├── React Hook Form
├── Zod (Validation)
├── Recharts (Graphiques)
└── Next-intl (i18n)
```

### Structure du projet

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Routes authentifiées
│   │   ├── dashboard/
│   │   ├── immeubles/
│   │   ├── logements/
│   │   ├── tickets/
│   │   └── layout.tsx
│   ├── (public)/                 # Routes publiques
│   │   ├── login/
│   │   ├── reset-password/
│   │   └── layout.tsx
│   ├── api/                      # API Routes (proxies si nécessaire)
│   ├── layout.tsx                # Layout racine
│   └── page.tsx                  # Page d'accueil
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   ├── building/
│   ├── housing/
│   ├── intervention/
│   ├── ticket/
│   └── ui/                       # Composants UI de base
├── lib/
│   ├── api/                      # Clients API
│   ├── hooks/                    # Custom hooks
│   ├── utils/                    # Utilitaires
│   └── types/                    # Types TypeScript
├── styles/
│   └── globals.css               # Styles globaux Tailwind
├── public/
│   ├── images/
│   └── icons/
└── package.json
```

---

## 📦 Dépendances principales

### Core
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

### Styling
```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.1.1"
  }
}
```

### State & Data Fetching
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.2"
  }
}
```

### Forms & Validation
```json
{
  "dependencies": {
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4"
  }
}
```

### Charts & Visualizations
```json
{
  "dependencies": {
    "recharts": "^2.10.3",
    "canvas-confetti": "^1.9.2"
  }
}
```

### Internationalization
```json
{
  "dependencies": {
    "next-intl": "^3.5.0"
  }
}
```

### Utilities
```json
{
  "dependencies": {
    "date-fns": "^3.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

---

## 🗺️ Plan de migration par phases

### Phase 0 : Préparation (1-2 semaines)

#### 0.1 Setup du projet
- [ ] Initialiser le projet Next.js avec TypeScript
- [ ] Configurer Tailwind CSS
- [ ] Configurer ESLint et Prettier
- [ ] Configurer les alias de chemins (`@/components`, etc.)
- [ ] Configurer les variables d'environnement
- [ ] Setup Git et CI/CD

#### 0.2 Infrastructure de base
- [ ] Créer la structure de dossiers
- [ ] Configurer React Query
- [ ] Configurer Zustand pour l'état global
- [ ] Créer le client API avec Axios
- [ ] Configurer next-intl pour l'i18n
- [ ] Créer les types TypeScript de base

#### 0.3 Design System
- [ ] Définir la palette de couleurs (basée sur le thème actuel)
- [ ] Créer les composants UI de base (Button, Input, Card, etc.)
- [ ] Créer le système de thème Tailwind
- [ ] Documenter le design system (Storybook optionnel)

---

### Phase 1 : Authentification & Layout (2-3 semaines)

#### 1.1 Authentification
- [ ] Page de login (`/login`)
- [ ] Gestion des sessions (cookies)
- [ ] Hook `useAuth`
- [ ] Middleware de protection des routes
- [ ] Page de réinitialisation de mot de passe
- [ ] Gestion des erreurs d'authentification

#### 1.2 Layout principal
- [ ] `AppLayout` (layout gestionnaire)
- [ ] `Header` avec logo, recherche, menu utilisateur
- [ ] `Sidebar` avec navigation
- [ ] `Footer`
- [ ] Breadcrumbs
- [ ] Layout occupant (simplifié)

#### 1.3 Navigation
- [ ] Menu latéral contextuel
- [ ] Navigation par rôles
- [ ] Badges de compteurs dans le menu
- [ ] Gestion de l'état actif

---

### Phase 2 : Dashboard & Immeubles (3-4 semaines)

#### 2.1 Dashboard
- [ ] Page dashboard (`/dashboard`)
- [ ] Cartes statistiques (immeubles, appareils)
- [ ] Jauges (transfert fichiers, relevés)
- [ ] Panneaux alertes (fuites, anomalies)
- [ ] Panneau chantiers
- [ ] Modal "Livret d'intervention"

#### 2.2 Liste d'immeubles
- [ ] Page liste (`/immeubles`)
- [ ] Composant `BuildingList`
- [ ] Composant `BuildingCard`
- [ ] Filtres (énergies, alertes, etc.)
- [ ] Recherche
- [ ] Affichage liste/grid
- [ ] Pagination (si nécessaire)

#### 2.3 Détail immeuble
- [ ] Page détail (`/immeubles/[id]`)
- [ ] Composant `BuildingDetail`
- [ ] Panneaux de consommation par énergie
- [ ] Graphiques d'évolution
- [ ] Graphique comparatif
- [ ] Panneau chantier
- [ ] Menu latéral contextuel

---

### Phase 3 : Logements (2-3 semaines)

#### 3.1 Liste de logements
- [ ] Page liste (`/immeubles/[id]/logements`)
- [ ] Composant `HousingList`
- [ ] Composant `HousingCard`
- [ ] Filtres
- [ ] Recherche

#### 3.2 Détail logement
- [ ] Page détail (`/logements/[id]`)
- [ ] Composant `HousingDetail`
- [ ] Onglets de consommation
- [ ] Panneaux par type d'énergie
- [ ] Informations appareils
- [ ] Formulaire d'intervention

---

### Phase 4 : Interventions & Alertes (2-3 semaines)

#### 4.1 Liste d'interventions
- [ ] Page liste (`/immeubles/[id]/interventions`)
- [ ] Composant `InterventionList`
- [ ] Composant `InterventionCard`
- [ ] Filtres avancés
- [ ] Export Excel

#### 4.2 Détail intervention
- [ ] Page détail (`/interventions/[id]`)
- [ ] Composant `InterventionDetail`
- [ ] Affichage PDF (si nécessaire)

#### 4.3 Alertes
- [ ] Liste fuites
- [ ] Liste anomalies
- [ ] Liste dysfonctionnements
- [ ] Filtres et exports

---

### Phase 5 : Tickets & Formulaires (2-3 semaines)

#### 5.1 Gestion des tickets
- [ ] Page liste tickets (`/tickets`)
- [ ] Composant `TicketList` (table DataTables-like)
- [ ] Composant `TicketDetail` (modal)
- [ ] Formulaire de création de ticket
- [ ] Clôture de ticket
- [ ] Affichage pièces jointes

#### 5.2 Formulaires
- [ ] Formulaire d'intervention (réutilisable)
- [ ] Formulaire de recherche avancée
- [ ] Validation avec Zod
- [ ] Gestion des erreurs

---

### Phase 6 : Espace Occupant (2 semaines)

#### 6.1 Dashboard occupant
- [ ] Page occupant (`/occupant`)
- [ ] Layout simplifié
- [ ] Panneaux de consommation
- [ ] Simulateur de consommation

#### 6.2 Fonctionnalités occupant
- [ ] Mon compte
- [ ] Gestion des alertes
- [ ] Relevés (PDF)

---

### Phase 7 : Administration (2 semaines)

#### 7.1 Gestion opérateurs
- [ ] Liste opérateurs (`/operators`)
- [ ] Création/édition opérateur
- [ ] Gestion des immeubles assignés
- [ ] Changement de mot de passe
- [ ] Statistiques

#### 7.2 Autres fonctionnalités admin
- [ ] Gestion des factures (si nécessaire)
- [ ] Statistiques globales

---

### Phase 8 : Optimisations & Finalisation (2-3 semaines)

#### 8.1 Performance
- [ ] Optimisation des images (Next.js Image)
- [ ] Code splitting
- [ ] Lazy loading des composants
- [ ] Optimisation des requêtes API
- [ ] Cache stratégique

#### 8.2 SEO & Accessibilité
- [ ] Meta tags dynamiques
- [ ] Sitemap
- [ ] Accessibilité (ARIA, keyboard navigation)
- [ ] Tests avec screen readers

#### 8.3 Tests
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Tests d'intégration
- [ ] Tests E2E (Playwright ou Cypress)
- [ ] Tests de performance (Lighthouse)

#### 8.4 Documentation
- [ ] Documentation des composants
- [ ] Guide de contribution
- [ ] Documentation API (si nécessaire)

---

## 🔧 Configuration technique détaillée

### Next.js Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['votre-domaine.com'],
  },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.votre-domaine.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        // Couleurs basées sur le thème actuel
      },
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Client API

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true, // Important pour les cookies de session
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### React Query Configuration

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## 🎨 Design System avec Tailwind

### Composants UI de base

#### Button

```typescript
// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          {
            'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
            'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
            'border border-gray-300 bg-transparent hover:bg-gray-50': variant === 'outline',
            'hover:bg-gray-100': variant === 'ghost',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

#### Card

```typescript
// components/ui/Card.tsx
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export { Card, CardHeader, CardTitle };
```

### Utilitaires

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 🔄 Migration des composants existants

### Exemple : Liste d'immeubles

#### Avant (Twig)

```twig
{% for infoImmeuble in immeubles %}
  <li data-fuites="{% if infoImmeuble.NbFuites > 0 %}O{% else %}N{% endif %}">
    <a href="{{ path('TechemCoreBundle_Immeuble_show', {'pkImmeuble': infoImmeuble.Immeuble.PkImmeuble}) }}">
      <div class="info">
        <div class="name">{{ 'Référence'|trans }} :</div>
        <div class="value">{{ infoImmeuble.Immeuble.Ref }}</div>
      </div>
    </a>
  </li>
{% endfor %}
```

#### Après (React + Tailwind)

```typescript
// components/building/BuildingCard.tsx
import Link from 'next/link';
import { Building } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

interface BuildingCardProps {
  building: Building;
}

export function BuildingCard({ building }: BuildingCardProps) {
  return (
    <Link href={`/immeubles/${building.Immeuble.PkImmeuble}`}>
      <div className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">Référence</div>
            <div className="font-semibold">{building.Immeuble.Ref}</div>
            <div className="text-sm text-gray-600 mt-1">
              {building.Immeuble.Adresse1}, {building.Immeuble.Cp} {building.Immeuble.Ville}
            </div>
          </div>
          <div className="flex gap-2">
            {building.NbFuites > 0 && (
              <Badge variant="blue">{building.NbFuites} fuites</Badge>
            )}
            {building.NbAnomalies > 0 && (
              <Badge variant="red">{building.NbAnomalies} anomalies</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### Exemple : Dashboard avec graphiques

```typescript
// app/(auth)/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { GaugeChart } from '@/components/dashboard/GaugeChart';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/api/dashboard').then(res => res.data.data),
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Aperçu de votre parc</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Immeubles"
          value={data.board.NbImmeubles}
          icon="building"
        />
        <StatCard
          title="Appareils"
          value={data.board.NbCompteurs}
          icon="meter"
        />
        <StatCard
          title="Fuites"
          value={data.board.NbFuites}
          icon="water"
          variant={data.board.NbFuites > 0 ? 'alert' : 'default'}
        />
        <StatCard
          title="Anomalies"
          value={data.board.NbAnomalies}
          icon="alert"
          variant={data.board.NbAnomalies > 0 ? 'alert' : 'default'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transfert électronique de fichiers</CardTitle>
          </CardHeader>
          <div className="p-6">
            <GaugeChart
              value={data.board.PcImmeublesTransfertFichiers / 100}
              label={`${data.board.PcImmeublesTransfertFichiers}% des immeubles`}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
```

---

## 🔐 Gestion de l'authentification

### Hook useAuth

```typescript
// lib/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await api.get('/api/security/me');
      return response.data.data;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await api.post('/api/security/login', credentials);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      router.push('/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/security/logout');
    },
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
}
```

### Middleware de protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('PHPSESSID');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isPublicPage = request.nextUrl.pathname.startsWith('/public');

  // Si pas de token et pas sur page publique, rediriger vers login
  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si token et sur page login, rediriger vers dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 🌐 Internationalisation

### Configuration next-intl

```typescript
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../messages/${locale}.json`)).default,
}));
```

### Utilisation dans les composants

```typescript
// components/building/BuildingCard.tsx
import { useTranslations } from 'next-intl';

export function BuildingCard({ building }: BuildingCardProps) {
  const t = useTranslations('Building');

  return (
    <div>
      <div className="text-sm text-gray-500">{t('reference')}</div>
      <div className="font-semibold">{building.Immeuble.Ref}</div>
    </div>
  );
}
```

---

## 📊 Graphiques et visualisations

### Jauge avec Recharts

```typescript
// components/dashboard/GaugeChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number; // 0-1
  label: string;
}

export function GaugeChart({ value, label }: GaugeChartProps) {
  const data = [
    { name: 'Filled', value: value * 100 },
    { name: 'Empty', value: (1 - value) * 100 },
  ];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
          >
            <Cell fill="#0ea5e9" />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold">{Math.round(value * 100)}%</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Tests

### Configuration Jest

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Exemple de test

```typescript
// components/building/__tests__/BuildingCard.test.tsx
import { render, screen } from '@testing-library/react';
import { BuildingCard } from '../BuildingCard';

const mockBuilding = {
  Immeuble: {
    PkImmeuble: '123',
    Ref: 'REF001',
    Adresse1: '123 Rue Test',
    Cp: '75001',
    Ville: 'Paris',
  },
  NbFuites: 2,
  NbAnomalies: 0,
};

describe('BuildingCard', () => {
  it('affiche les informations de l\'immeuble', () => {
    render(<BuildingCard building={mockBuilding} />);
    
    expect(screen.getByText('REF001')).toBeInTheDocument();
    expect(screen.getByText(/123 Rue Test/)).toBeInTheDocument();
  });

  it('affiche le badge de fuites si présent', () => {
    render(<BuildingCard building={mockBuilding} />);
    
    expect(screen.getByText(/2 fuites/)).toBeInTheDocument();
  });
});
```

---

## 🚀 Déploiement

### Build de production

```bash
npm run build
npm start
```

### Variables d'environnement

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
NEXT_PUBLIC_APP_URL=https://app.votre-domaine.com
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📈 Métriques de succès

### Performance
- ✅ Lighthouse Score > 90
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ Bundle size < 200KB (gzipped)

### Qualité
- ✅ Couverture de tests > 80%
- ✅ Aucune erreur TypeScript
- ✅ Accessibilité WCAG 2.1 AA

### Fonctionnalités
- ✅ 100% des fonctionnalités existantes migrées
- ✅ Tous les rôles et permissions fonctionnels
- ✅ Support multilingue complet

---

## ⚠️ Risques et mitigation

### Risques identifiés

1. **Complexité de migration des graphiques**
   - **Mitigation** : Utiliser Recharts (similaire à DevExtreme)
   - **Fallback** : Intégrer DevExtreme si nécessaire

2. **Performance des listes longues**
   - **Mitigation** : Virtualisation (react-window)
   - **Optimisation** : Pagination côté serveur

3. **Compatibilité navigateurs**
   - **Mitigation** : Polyfills via Next.js
   - **Tests** : Tests sur navigateurs cibles

4. **Migration des données complexes**
   - **Mitigation** : Types TypeScript stricts
   - **Validation** : Zod pour validation runtime

---

## 📅 Timeline estimée

| Phase | Durée | Équipe |
|-------|-------|--------|
| Phase 0 : Préparation | 1-2 semaines | 1-2 devs |
| Phase 1 : Auth & Layout | 2-3 semaines | 2 devs |
| Phase 2 : Dashboard & Immeubles | 3-4 semaines | 2-3 devs |
| Phase 3 : Logements | 2-3 semaines | 2 devs |
| Phase 4 : Interventions | 2-3 semaines | 2 devs |
| Phase 5 : Tickets | 2-3 semaines | 2 devs |
| Phase 6 : Occupant | 2 semaines | 1-2 devs |
| Phase 7 : Administration | 2 semaines | 1-2 devs |
| Phase 8 : Optimisations | 2-3 semaines | 2 devs |
| **TOTAL** | **18-26 semaines** | **2-3 devs** |

---

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation React Query](https://tanstack.com/query/latest)
- [Documentation next-intl](https://next-intl-docs.vercel.app/)
- [Analyse Architecture Frontend](./FRONTEND_ARCHITECTURE_ANALYSIS.md)
- [Documentation API](./API_DOCUMENTATION.md)

---

**Document créé le** : 2025-01-XX  
**Version** : 1.0  
**Auteur** : Équipe de développement

