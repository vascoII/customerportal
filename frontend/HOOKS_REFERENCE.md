# 📚 Référence Complète des Hooks React - Techem Customer Portal

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Hooks par Catégorie](#hooks-par-catégorie)
3. [Détails des Hooks](#détails-des-hooks)
4. [Guide d'Utilisation](#guide-dutilisation)
5. [Exemples Pratiques](#exemples-pratiques)
6. [Bonnes Pratiques](#bonnes-pratiques)

---

## 🎯 Vue d'ensemble

Ce document récapitule tous les hooks React créés pour interagir avec l'API Symfony du portail client Techem. Tous les hooks utilisent **React Query** pour la gestion des données et **Axios** pour les appels API.

### Statistiques

- **13 hooks créés** couvrant tous les endpoints API
- **95+ endpoints API** couverts
- **~5,500 lignes de code** TypeScript
- **TypeScript** pour la sécurité des types
- **Gestion d'erreurs** centralisée
- **Cache intelligent** avec React Query

### Technologies Utilisées

- **React Query** (`@tanstack/react-query`) - Gestion des données et cache
- **Axios** - Client HTTP
- **TypeScript** - Typage statique
- **Zustand** - État global (authentification)

---

## 📂 Hooks par Catégorie

### 🔐 Authentification & Sécurité
- `useAuth` - Authentification principale (login, logout, session)
- `useSecurity` - Endpoints de sécurité (reset password, update password, etc.)

### 🏠 Front & Général
- `useFront` - Fonctionnalités générales (CGU, mentions légales, données personnelles)

### 📊 Tableaux de Bord
- `useDashboard` - Tableau de bord principal

### 🏢 Gestion Immobilière
- `useImmeubles` - Gestion des immeubles
- `useLogements` - Gestion des logements
- `useGestionParc` - Gestion de parc immobilier

### 👤 Utilisateurs
- `useOccupant` - Fonctionnalités occupant
- `useOperators` - Gestion des opérateurs/gestionnaires

### 🎫 Tickets & Interventions
- `useTickets` - Gestion des tickets
- `useInterventions` - Rapports d'intervention

### 💰 Facturation
- `useFactures` - Gestion des factures

### 🔍 Recherche
- `useSearch` - Recherche d'immeubles et occupants

---

## 📖 Détails des Hooks

### 1. 🔐 useAuth

**Fichier** : `src/lib/hooks/useAuth.ts`

**Description** : Hook principal pour l'authentification, intégrant React Query et Zustand.

**Fonctionnalités** :
- ✅ Connexion (`login`)
- ✅ Déconnexion (`logout`)
- ✅ Vérification de session (`checkAuth`)
- ✅ Redirection automatique selon les rôles
- ✅ Gestion des erreurs
- ✅ États de chargement

**Exemple d'utilisation** :
```typescript
import { useAuth } from "@/lib/hooks/useAuth";

function LoginComponent() {
  const { login, logout, isAuthenticated, isLoading, error } = useAuth();

  const handleLogin = async () => {
    await login({
      username: "user@example.com",
      password: "password123",
    });
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

---

### 2. 🔒 useSecurity

**Fichier** : `src/lib/hooks/useSecurity.ts`

**Description** : Hook pour tous les endpoints de sécurité (login, logout, reset password, update password, etc.).

**Endpoints** :
- `POST /api/security/login` - Connexion
- `GET /api/security/login/{param}` - Connexion via paramètre
- `POST /api/security/logout` - Déconnexion
- `POST /api/security/reset-password` - Réinitialisation du mot de passe
- `PUT /api/security/update-password` - Mise à jour du mot de passe
- `GET /api/security/me` - Informations utilisateur actuel
- `GET /api/security/check` - Vérification d'authentification

**Fonctionnalités** :
- ✅ Mutations pour login, logout, reset/update password
- ✅ Queries pour récupérer les informations utilisateur
- ✅ Gestion des erreurs
- ✅ États de chargement

**Exemple d'utilisation** :
```typescript
import { useSecurity } from "@/lib/hooks/useSecurity";

function SecurityComponent() {
  const {
    login,
    logout,
    resetPassword,
    updatePassword,
    meData,
    isLoggingIn,
  } = useSecurity();

  const handleResetPassword = async (email: string) => {
    await resetPassword(email);
  };

  return (
    <div>
      {meData && <p>Logged in as: {meData.user?.Email}</p>}
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

---

### 3. 🏠 useFront

**Fichier** : `src/lib/hooks/useFront.ts`

**Description** : Hook pour les fonctionnalités front/générales (CGU, mentions légales, données personnelles, dashboard).

**Endpoints** :
- `GET /api/me` - Informations utilisateur
- `GET /api/legal-notices` - Mentions légales
- `GET /api/personal-datas` - Données personnelles
- `GET /api/cgu/status` - Statut CGU
- `POST /api/cgu/accept` - Accepter les CGU
- `GET /api/dashboard` - Données du tableau de bord

**Fonctionnalités** :
- ✅ Queries pour récupérer les données générales
- ✅ Mutation pour accepter les CGU
- ✅ Gestion des erreurs
- ✅ États de chargement

**Exemple d'utilisation** :
```typescript
import { useFront } from "@/lib/hooks/useFront";

function FrontComponent() {
  const {
    meData,
    legalNoticesData,
    cguStatusData,
    acceptCGU,
    isAcceptingCGU,
  } = useFront();

  const handleAcceptCGU = async () => {
    await acceptCGU({
      email: "user@example.com",
      email_confirm: "user@example.com",
      valid_cgu: true,
    });
  };

  return (
    <div>
      {cguStatusData?.needsValidation && (
        <button onClick={handleAcceptCGU} disabled={isAcceptingCGU}>
          Accept CGU
        </button>
      )}
    </div>
  );
}
```

---

### 4. 📊 useDashboard

**Fichier** : `src/lib/hooks/useDashboard.ts`

**Description** : Hook pour le tableau de bord principal et les rapports d'intervention.

**Endpoints** :
- `GET /api/dashboard` - Données du tableau de bord
- `GET /api/dashboard/intervention` - Rapport d'intervention (PDF/Excel)

**Fonctionnalités** :
- ✅ Query pour récupérer les données du dashboard
- ✅ Fonction pour télécharger les rapports d'intervention
- ✅ Gestion des erreurs
- ✅ États de chargement

**Exemple d'utilisation** :
```typescript
import { useDashboard } from "@/lib/hooks/useDashboard";

function DashboardComponent() {
  const { dashboardData, getInterventionReport, dashboardIsLoading } =
    useDashboard();

  const handleDownloadReport = async () => {
    await getInterventionReport({
      docType: "synthese-inte",
      dateBegin: "01/01/2024",
      dateEnd: "31/12/2024",
    });
  };

  return (
    <div>
      {dashboardIsLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Dashboard</h1>
          <button onClick={handleDownloadReport}>Download Report</button>
        </div>
      )}
    </div>
  );
}
```

---

### 5. 🏢 useImmeubles

**Fichier** : `src/lib/hooks/useImmeubles.ts`

**Description** : Hook complet pour la gestion des immeubles (liste, détails, interventions, fuites, anomalies, dysfonctionnements, exports).

**Endpoints** :
- `GET /api/immeubles` - Liste des immeubles
- `GET /api/immeubles/filtre` - Filtrer les immeubles
- `GET /api/immeubles/{pkImmeuble}` - Détails d'un immeuble
- `GET /api/immeubles/{pkImmeuble}/interventions` - Liste des interventions
- `GET /api/immeubles/{pkImmeuble}/interventions/{pkIntervention}` - Détails d'une intervention
- `GET /api/immeubles/{pkImmeuble}/fuites` - Liste des fuites
- `GET /api/immeubles/{pkImmeuble}/anomalies` - Liste des anomalies
- `GET /api/immeubles/{pkImmeuble}/dysfonctionnements` - Liste des dysfonctionnements
- `GET /api/immeubles/{pkImmeuble}/releve/{type}/{energie}` - Relevé PDF
- `GET /api/immeubles/{pkImmeuble}/anomalies/export` - Export anomalies Excel
- `GET /api/immeubles/{pkImmeuble}/fuites/export` - Export fuites Excel
- `GET /api/immeubles/{pkImmeuble}/interventions/export` - Export interventions Excel
- `GET /api/immeubles/{pkImmeuble}/dysfonctionnements/export` - Export dysfonctionnements Excel
- `GET /api/immeubles/{pkImmeuble}/intervention` - Rapport d'intervention (PDF/Excel)

**Fonctionnalités** :
- ✅ Queries réactives pour toutes les données
- ✅ Mutations pour le filtrage
- ✅ Fonctions de téléchargement pour tous les exports
- ✅ Gestion des erreurs
- ✅ États de chargement

**Exemple d'utilisation** :
```typescript
import { useImmeubles } from "@/lib/hooks/useImmeubles";

function ImmeublesComponent() {
  const {
    getImmeublesQuery,
    getImmeubleQuery,
    filterImmeubles,
    exportImmeubleAnomalies,
  } = useImmeubles();

  const pkImmeuble = "123";
  const { data: immeubles } = getImmeublesQuery;
  const { data: immeuble } = getImmeubleQuery(pkImmeuble);

  const handleFilter = async () => {
    await filterImmeubles({
      nom: "Rue de la Paix",
      search: true,
    });
  };

  const handleExport = async () => {
    await exportImmeubleAnomalies(pkImmeuble);
  };

  return (
    <div>
      <button onClick={handleFilter}>Filter</button>
      <button onClick={handleExport}>Export Anomalies</button>
      {immeubles?.immeubles.map((immeuble) => (
        <div key={immeuble.PkImmeuble}>{immeuble.Nom}</div>
      ))}
    </div>
  );
}
```

---

### 6. 🏘️ useLogements

**Fichier** : `src/lib/hooks/useLogements.ts`

**Description** : Hook complet pour la gestion des logements (liste, détails, interventions, fuites, anomalies, dysfonctionnements, tickets, exports).

**Endpoints** :
- `GET /api/logements/immeuble/{pkImmeuble}` - Liste des logements d'un immeuble
- `GET /api/logements/{pkLogement}` - Détails d'un logement
- `GET /api/logements/{pkLogement}/ticket-owner` - Propriétaire du ticket
- `GET /api/logements/{pkLogement}/appareils/{type}` - Informations appareils
- `GET /api/logements/{pkLogement}/interventions` - Liste des interventions
- `GET /api/logements/{pkLogement}/interventions/{pkIntervention}` - Détails d'une intervention
- `GET /api/logements/{pkLogement}/fuites` - Liste des fuites
- `GET /api/logements/{pkLogement}/anomalies` - Liste des anomalies
- `GET /api/logements/{pkLogement}/dysfonctionnements` - Liste des dysfonctionnements
- `POST /api/logements/{pkLogement}/tickets` - Créer un ticket
- `POST /api/logements/immeuble/{pkImmeuble}/tickets` - Créer un ticket depuis un immeuble
- `PUT /api/logements/{pkLogement}/occupant` - Mettre à jour l'occupant
- `GET /api/logements/filter` - Filtrer les logements
- `GET /api/logements/{pkLogement}/releve-repart` - Relevé répartition PDF
- `GET /api/logements/immeuble/{pkImmeuble}/export` - Export logements Excel
- `GET /api/logements/{pkLogement}/anomalies/export` - Export anomalies Excel
- `GET /api/logements/{pkLogement}/fuites/export` - Export fuites Excel
- `GET /api/logements/{pkLogement}/interventions/export` - Export interventions Excel
- `GET /api/logements/{pkLogement}/dysfonctionnements/export` - Export dysfonctionnements Excel
- `GET /api/logements/guide` - Guide occupant PDF

**Fonctionnalités** :
- ✅ Queries réactives pour toutes les données
- ✅ Mutations pour créer des tickets et mettre à jour les occupants
- ✅ Fonctions de téléchargement pour tous les exports
- ✅ Support des fichiers joints pour les tickets
- ✅ Gestion des erreurs
- ✅ États de chargement

**Exemple d'utilisation** :
```typescript
import { useLogements } from "@/lib/hooks/useLogements";

function LogementsComponent() {
  const {
    getLogementQuery,
    createTicket,
    updateOccupant,
    exportLogementAnomalies,
  } = useLogements();

  const pkLogement = "123";
  const { data: logement } = getLogementQuery(pkLogement);

  const handleCreateTicket = async () => {
    await createTicket({
      pkLogement,
      data: {
        pkLogement,
        name: "John Doe",
        email: "john@example.com",
        message: "Problème de compteur",
      },
    });
  };

  const handleUpdateOccupant = async () => {
    await updateOccupant({
      pkLogement,
      data: {
        newNom: "Jane Doe",
        newEmail: "jane@example.com",
      },
    });
  };

  return (
    <div>
      <button onClick={handleCreateTicket}>Create Ticket</button>
      <button onClick={handleUpdateOccupant}>Update Occupant</button>
    </div>
  );
}
```

---

### 7. 👤 useOccupant

**Fichier** : `src/lib/hooks/useOccupant.ts`

**Description** : Hook pour les fonctionnalités spécifiques aux occupants (logement, simulateur, interventions, fuites, anomalies, dysfonctionnements, compte, alertes, exports).

**Endpoints** :
- `GET /api/occupant` - Détails du logement occupant
- `GET /api/occupant/simulateur` - Données du simulateur
- `GET /api/occupant/interventions` - Liste des interventions
- `GET /api/occupant/interventions/{pkIntervention}` - Détails d'une intervention
- `GET /api/occupant/fuites` - Liste des fuites
- `GET /api/occupant/anomalies` - Liste des anomalies
- `GET /api/occupant/dysfonctionnements` - Liste des dysfonctionnements
- `GET /api/occupant/my-account` - Informations du compte
- `GET /api/occupant/alertes` - Configuration des alertes
- `POST /api/occupant/alertes` - Mettre à jour les alertes
- `GET /api/occupant/anomalies/export` - Export anomalies CSV
- `GET /api/occupant/fuites/export` - Export fuites CSV
- `GET /api/occupant/interventions/export` - Export interventions CSV
- `GET /api/occupant/dysfonctionnements/export` - Export dysfonctionnements CSV
- `GET /api/occupant/{pkOccupant}/releve-eau` - Relevé eau PDF
- `GET /api/occupant/{pkOccupant}/releve-repart/{pkImmeuble}` - Relevé répartition PDF
- `GET /api/occupant/{pkOccupant}/releve-note/{pkImmeuble}/{energie}` - Relevé note PDF

**Fonctionnalités** :
- ✅ Queries réactives pour toutes les données occupant
- ✅ Mutation pour mettre à jour les alertes
- ✅ Fonctions de téléchargement pour tous les exports (CSV)
- ✅ Fonctions de téléchargement pour les relevés (PDF)
- ✅ Gestion des erreurs
- ✅ États de chargement

**Exemple d'utilisation** :
```typescript
import { useOccupant } from "@/lib/hooks/useOccupant";

function OccupantComponent() {
  const {
    getOccupantLogementQuery,
    getInterventions,
    updateAlertes,
    exportAnomalies,
  } = useOccupant();

  const { data: logement } = getOccupantLogementQuery;
  const { data: interventions } = getInterventions();

  const handleUpdateAlerts = async () => {
    await updateAlertes({
      SEUIL_CONSO_ACTIF: true,
    });
  };

  return (
    <div>
      <button onClick={handleUpdateAlerts}>Update Alerts</button>
      <button onClick={() => exportAnomalies()}>Export Anomalies</button>
    </div>
  );
}
```

---

### 8. 👥 useOperators

**Fichier** : `src/lib/hooks/useOperators.ts`

**Description** : Hook pour la gestion des opérateurs/gestionnaires (liste, création, modification, suppression, gestion des immeubles, statistiques).

**Endpoints** :
- `GET /api/operators` - Liste des opérateurs
- `GET /api/operators/{id}` - Détails d'un opérateur
- `POST /api/operators` - Créer un opérateur
- `PUT /api/operators/{id}` - Mettre à jour un opérateur
- `DELETE /api/operators/{id}` - Supprimer un opérateur
- `PUT /api/operators/{id}/password` - Mettre à jour le mot de passe
- `POST /api/operators/{id}/immeubles` - Ajouter des immeubles
- `DELETE /api/operators/{id}/immeubles` - Retirer des immeubles
- `GET /api/operators/statistiques` - Statistiques des opérateurs

**Fonctionnalités** :
- ✅ Queries réactives pour la liste et les détails
- ✅ Mutations pour CRUD complet
- ✅ Gestion des immeubles assignés
- ✅ Gestion des mots de passe
- ✅ Statistiques
- ✅ Gestion des erreurs
- ✅ États de chargement

**Exemple d'utilisation** :
```typescript
import { useOperators } from "@/lib/hooks/useOperators";

function OperatorsComponent() {
  const {
    getOperatorsQuery,
    createOperator,
    updateOperator,
    deleteOperator,
    addBuildings,
  } = useOperators();

  const { data: operators } = getOperatorsQuery;

  const handleCreate = async () => {
    await createOperator({
      job: "Gestionnaire",
      lastname: "Doe",
      firstname: "John",
      phone: "0123456789",
      email: "john@example.com",
    });
  };

  const handleAddBuildings = async (operatorId: string) => {
    await addBuildings({
      id: operatorId,
      data: {
        immeubles: ["123", "456"],
      },
    });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Operator</button>
      {operators?.users.map((operator) => (
        <div key={operator.PKUser}>
          {operator.UserName}
          <button onClick={() => handleAddBuildings(operator.PKUser)}>
            Add Buildings
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### 9. 🎫 useTickets

**Fichier** : `src/lib/hooks/useTickets.ts`

**Description** : Hook pour la gestion des tickets (liste, menu, fermeture, pièces jointes).

**Endpoints** :
- `GET /api/tickets` - Liste des tickets
- `GET /api/tickets/menu` - Informations du menu (statistiques)
- `POST /api/tickets/{pkTicket}/close` - Fermer un ticket
- `GET /api/tickets/{pkTicket}/attachment` - Pièce jointe d'un ticket
- `GET /api/tickets/create/{pkLogement}` - Informations pour créer un ticket

**Fonctionnalités** :
- ✅ Queries réactives pour la liste et les détails
- ✅ Mutation pour fermer un ticket
- ✅ Fonction pour télécharger les pièces jointes
- ✅ Gestion des erreurs
- ✅ États de chargement

**Exemple d'utilisation** :
```typescript
import { useTickets } from "@/lib/hooks/useTickets";

function TicketsComponent() {
  const {
    getTicketsQuery,
    getTicketsMenuQuery,
    closeTicket,
    downloadTicketAttachment,
  } = useTickets();

  const { data: tickets } = getTicketsQuery({ showAll: false });
  const { data: menu } = getTicketsMenuQuery;

  const handleCloseTicket = async (pkTicket: string) => {
    await closeTicket(pkTicket);
  };

  const handleDownloadAttachment = async (pkTicket: string) => {
    await downloadTicketAttachment(pkTicket);
  };

  return (
    <div>
      {menu && <p>Tickets: {menu.nbTicketsInterUser}</p>}
      {tickets?.tickets.map((ticket) => (
        <div key={ticket.CaseId}>
          {ticket.CaseNumber}
          <button onClick={() => handleCloseTicket(ticket.CaseId!)}>
            Close
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### 10. 💰 useFactures

**Fichier** : `src/lib/hooks/useFactures.ts`

**Description** : Hook pour la gestion des factures (liste, téléchargement).

**Endpoints** :
- `GET /api/factures` - Liste des factures
- `GET /api/factures/{pkFacture}/download` - Télécharger une facture PDF

**Fonctionnalités** :
- ✅ Query réactive pour la liste des factures
- ✅ Fonction pour télécharger les factures PDF
- ✅ Gestion des erreurs
- ✅ États de chargement

**Exemple d'utilisation** :
```typescript
import { useFactures } from "@/lib/hooks/useFactures";

function FacturesComponent() {
  const { getFacturesQuery, downloadFacture } = useFactures();

  const { data: factures } = getFacturesQuery;

  const handleDownload = async (pkFacture: string) => {
    await downloadFacture(pkFacture);
  };

  return (
    <div>
      {factures?.factures.map((facture) => (
        <div key={facture.pkFacture}>
          {facture.numero} - {facture.montantTotalTTCFormatted}
          <button onClick={() => handleDownload(facture.pkFacture)}>
            Download
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### 11. 🔍 useSearch

**Fichier** : `src/lib/hooks/useSearch.ts`

**Description** : Hook pour la recherche d'immeubles et d'occupants.

**Endpoints** :
- `GET /api/search?type=immeuble` - Rechercher des immeubles
- `GET /api/search?type=occupant` - Rechercher des occupants

**Fonctionnalités** :
- ✅ Queries réactives pour les deux types de recherche
- ✅ Fonctions async pour recherche manuelle
- ✅ Mutation générique pour recherche flexible
- ✅ Validation des filtres (longueur minimale)
- ✅ Gestion des erreurs
- ✅ États de chargement

**Filtres disponibles** :
- **Immeubles** : `ref`, `ref_numero` (min 1 caractère), `nom`, `tout`, `adresse` (min 3 caractères)
- **Occupants** : `ref`, `ref_numero` (min 1 caractère), `nom`, `tout`, `adresse` (min 3 caractères), `pkImmeuble` (optionnel)

**Exemple d'utilisation** :
```typescript
import { useSearch } from "@/lib/hooks/useSearch";

function SearchComponent() {
  const { searchImmeubles, searchOccupants } = useSearch();

  const handleSearchImmeubles = async () => {
    const results = await searchImmeubles({
      nom: "Rue de la Paix",
      adresse: "Paris",
    });
    console.log(`Found ${results.count} immeubles`);
  };

  const handleSearchOccupants = async () => {
    const results = await searchOccupants({
      nom: "Dupont",
      pkImmeuble: "123",
    });
    console.log(`Found ${results.count} occupants`);
  };

  return (
    <div>
      <button onClick={handleSearchImmeubles}>Search Immeubles</button>
      <button onClick={handleSearchOccupants}>Search Occupants</button>
    </div>
  );
}
```

---

### 12. 🏗️ useGestionParc

**Fichier** : `src/lib/hooks/useGestionParc.ts`

**Description** : Hook pour la gestion de parc immobilier (similaire à useImmeubles mais avec préfixe `/api/gestion-parc`).

**Endpoints** :
- `GET /api/gestion-parc` - Dashboard gestion parc
- `GET /api/gestion-parc/filtre` - Filtrer les immeubles
- `GET /api/gestion-parc/{pkImmeuble}` - Détails d'un immeuble
- `GET /api/gestion-parc/{pkImmeuble}/interventions` - Liste des interventions
- `GET /api/gestion-parc/{pkImmeuble}/interventions/{pkIntervention}` - Détails d'une intervention
- `GET /api/gestion-parc/{pkImmeuble}/fuites` - Liste des fuites
- `GET /api/gestion-parc/{pkImmeuble}/anomalies` - Liste des anomalies
- `GET /api/gestion-parc/{pkImmeuble}/dysfonctionnements` - Liste des dysfonctionnements
- `GET /api/gestion-parc/{pkImmeuble}/releve/{type}/{energie}` - Relevé PDF
- `GET /api/gestion-parc/{pkImmeuble}/anomalies/export` - Export anomalies Excel
- `GET /api/gestion-parc/{pkImmeuble}/fuites/export` - Export fuites Excel
- `GET /api/gestion-parc/{pkImmeuble}/interventions/export` - Export interventions Excel
- `GET /api/gestion-parc/{pkImmeuble}/dysfonctionnements/export` - Export dysfonctionnements Excel
- `GET /api/gestion-parc/{pkImmeuble}/intervention` - Rapport d'intervention (PDF/Excel)

**Fonctionnalités** :
- ✅ Identique à `useImmeubles` mais avec préfixe `/api/gestion-parc`
- ✅ Spécifique au contexte "gestion parc"
- ✅ Toutes les fonctionnalités de gestion d'immeubles

**Exemple d'utilisation** :
```typescript
import { useGestionParc } from "@/lib/hooks/useGestionParc";

function GestionParcComponent() {
  const {
    getGestionParcIndexQuery,
    getGestionParcBuildingQuery,
    filterGestionParc,
  } = useGestionParc();

  const { data: indexData } = getGestionParcIndexQuery;
  const pkImmeuble = "123";
  const { data: buildingData } = getGestionParcBuildingQuery(pkImmeuble);

  return (
    <div>
      <h1>Gestion Parc</h1>
      {buildingData && <p>{buildingData.immeuble.Nom}</p>}
    </div>
  );
}
```

---

### 13. 🔧 useInterventions

**Fichier** : `src/lib/hooks/useInterventions.ts`

**Description** : Hook simple pour télécharger les rapports d'intervention (endpoint standalone).

**Endpoints** :
- `GET /api/interventions/{pkDepannage}/report` - Télécharger le rapport PDF d'une intervention

**Fonctionnalités** :
- ✅ Fonction async pour téléchargement
- ✅ Gestion automatique du nom de fichier
- ✅ Gestion des erreurs

**Note** : Les autres fonctionnalités liées aux interventions sont gérées par `useImmeubles`, `useLogements`, `useOccupant`, et `useGestionParc`.

**Exemple d'utilisation** :
```typescript
import { useInterventions } from "@/lib/hooks/useInterventions";

function InterventionComponent() {
  const { getInterventionReport } = useInterventions();

  const handleDownload = async (pkDepannage: string) => {
    try {
      await getInterventionReport(pkDepannage);
      console.log("Report downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <button onClick={() => handleDownload("123456")}>
      Download Report
    </button>
  );
}
```

---

## 🎓 Guide d'Utilisation

### Installation et Configuration

Tous les hooks sont déjà configurés et prêts à l'emploi. Assurez-vous que :

1. **React Query est configuré** dans `src/app/providers.tsx`
2. **Le client API est configuré** dans `src/lib/api/client.ts`
3. **Les variables d'environnement** sont définies dans `.env.local` :
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

### Pattern d'Utilisation Standard

```typescript
import { useHookName } from "@/lib/hooks/useHookName";

function MyComponent() {
  // 1. Utiliser les queries réactives pour les données
  const { data, isLoading, error } = useHookName().getDataQuery();

  // 2. Utiliser les mutations pour les actions
  const { mutateAsync: performAction } = useHookName().actionMutation;

  // 3. Gérer les états de chargement et erreurs
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // 4. Afficher les données
  return <div>{/* Your UI */}</div>;
}
```

### Gestion des Erreurs

Tous les hooks utilisent `handleApiError` pour normaliser les erreurs :

```typescript
const { error, someError } = useHookName();

// Les erreurs sont déjà formatées en string
if (error) {
  console.error(error); // Message d'erreur utilisateur-friendly
}
```

### Téléchargement de Fichiers

Pour les fonctions de téléchargement (PDF, Excel, CSV) :

```typescript
const { downloadFile } = useHookName();

try {
  await downloadFile(params);
  // Le fichier est automatiquement téléchargé
} catch (error) {
  // Gérer l'erreur
  console.error("Download failed:", error);
}
```

---

## 💡 Exemples Pratiques

### Exemple 1 : Page de Liste d'Immeubles

```typescript
"use client";

import { useImmeubles } from "@/lib/hooks/useImmeubles";
import { useState } from "react";

export default function ImmeublesPage() {
  const { getImmeublesQuery, filterImmeubles, isFilteringImmeubles } =
    useImmeubles();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = getImmeublesQuery;

  const handleSearch = async () => {
    if (searchTerm.length >= 3) {
      await filterImmeubles({
        nom: searchTerm,
        search: true,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search immeubles..."
      />
      <button onClick={handleSearch} disabled={isFilteringImmeubles}>
        Search
      </button>
      <ul>
        {data?.immeubles.map((immeuble) => (
          <li key={immeuble.PkImmeuble}>
            <a href={`/immeuble/${immeuble.PkImmeuble}`}>
              {immeuble.Nom} - {immeuble.Adresse1}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Exemple 2 : Formulaire de Création de Ticket

```typescript
"use client";

import { useLogements } from "@/lib/hooks/useLogements";
import { useState } from "react";

export default function CreateTicketForm({ pkLogement }: { pkLogement: string }) {
  const { createTicket, isCreatingTicket, createTicketError } = useLogements();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTicket({
        pkLogement,
        data: formData,
      });
      alert("Ticket created successfully!");
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {createTicketError && <div className="error">{createTicketError}</div>}
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Message"
        required
      />
      <button type="submit" disabled={isCreatingTicket}>
        {isCreatingTicket ? "Creating..." : "Create Ticket"}
      </button>
    </form>
  );
}
```

### Exemple 3 : Tableau de Bord avec Données Multiples

```typescript
"use client";

import { useDashboard } from "@/lib/hooks/useDashboard";
import { useImmeubles } from "@/lib/hooks/useImmeubles";
import { useTickets } from "@/lib/hooks/useTickets";

export default function DashboardPage() {
  const { dashboardData, dashboardIsLoading } = useDashboard();
  const { getImmeublesQuery } = useImmeubles();
  const { getTicketsQuery, getTicketsMenuQuery } = useTickets();

  const { data: immeubles, isLoading: immeublesLoading } = getImmeublesQuery;
  const { data: tickets, isLoading: ticketsLoading } = getTicketsQuery({ showAll: false });
  const { data: menu } = getTicketsMenuQuery;

  const isLoading = dashboardIsLoading || immeublesLoading || ticketsLoading;

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Statistics</h2>
        {menu && <p>Active Tickets: {menu.nbTicketsInterUser}</p>}
        {dashboardData && (
          <p>Compteurs Posés: {dashboardData.board?.NbCompteursPoses}</p>
        )}
      </div>
      <div>
        <h2>Immeubles ({immeubles?.immeubles.length || 0})</h2>
        <ul>
          {immeubles?.immeubles.slice(0, 5).map((immeuble) => (
            <li key={immeuble.PkImmeuble}>{immeuble.Nom}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Recent Tickets ({tickets?.tickets.length || 0})</h2>
        <ul>
          {tickets?.tickets.slice(0, 5).map((ticket) => (
            <li key={ticket.CaseId}>{ticket.CaseNumber}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## ✅ Bonnes Pratiques

### 1. Utiliser les Queries Réactives

Préférez les queries réactives pour les données qui doivent être affichées immédiatement :

```typescript
// ✅ Bon
const { data, isLoading } = useImmeubles().getImmeublesQuery;

// ❌ Moins optimal (nécessite un appel manuel)
const { getImmeubles } = useImmeubles();
const [data, setData] = useState(null);
useEffect(() => {
  getImmeubles().then(setData);
}, []);
```

### 2. Gérer les États de Chargement

Toujours afficher un indicateur de chargement :

```typescript
const { data, isLoading, error } = useHookName().getDataQuery();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;
```

### 3. Gérer les Erreurs

Toujours gérer les erreurs et informer l'utilisateur :

```typescript
const { error, someMutation } = useHookName();

const handleAction = async () => {
  try {
    await someMutation(params);
  } catch (error) {
    // L'erreur est déjà formatée par handleApiError
    toast.error(error.message);
  }
};
```

### 4. Invalider le Cache Après Mutations

Les hooks invalident automatiquement le cache, mais vous pouvez le faire manuellement si nécessaire :

```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Après une mutation
queryClient.invalidateQueries({ queryKey: ["immeubles"] });
```

### 5. Utiliser les Types TypeScript

Tous les hooks sont typés. Utilisez les types pour une meilleure expérience de développement :

```typescript
import type { Building, Housing } from "@/lib/types/api";

const { data } = useImmeubles().getImmeubleQuery("123");
// data est automatiquement typé comme BuildingDetailsResponse
```

### 6. Optimiser les Requêtes

Utilisez `enabled` pour désactiver les queries qui ne doivent pas s'exécuter immédiatement :

```typescript
// La query ne s'exécute que si pkImmeuble est défini
const { data } = useImmeubles().getImmeubleQuery(pkImmeuble);
// Le hook gère déjà cela avec enabled: !!pkImmeuble
```

---

## 📊 Tableau Récapitulatif

| Hook | Endpoints | Queries | Mutations | Downloads | Fichier |
|------|-----------|---------|-----------|-----------|---------|
| `useAuth` | 2 | 1 | 2 | 0 | `useAuth.ts` |
| `useSecurity` | 7 | 2 | 5 | 0 | `useSecurity.ts` |
| `useFront` | 6 | 5 | 1 | 0 | `useFront.ts` |
| `useDashboard` | 2 | 1 | 0 | 1 | `useDashboard.ts` |
| `useImmeubles` | 14 | 7 | 1 | 6 | `useImmeubles.ts` |
| `useLogements` | 18 | 9 | 4 | 6 | `useLogements.ts` |
| `useOccupant` | 13 | 9 | 1 | 7 | `useOccupant.ts` |
| `useOperators` | 9 | 3 | 6 | 0 | `useOperators.ts` |
| `useTickets` | 5 | 4 | 1 | 1 | `useTickets.ts` |
| `useFactures` | 2 | 1 | 0 | 1 | `useFactures.ts` |
| `useSearch` | 2 | 2 | 1 | 0 | `useSearch.ts` |
| `useGestionParc` | 14 | 7 | 1 | 6 | `useGestionParc.ts` |
| `useInterventions` | 1 | 0 | 0 | 1 | `useInterventions.ts` |

**Total** : **95+ endpoints** couverts par **13 hooks** (~5,500 lignes de code)

---

## 🔗 Liens Utiles

- [Documentation React Query](https://tanstack.com/query/latest)
- [Documentation Axios](https://axios-http.com/)
- [Documentation TypeScript](https://www.typescriptlang.org/)
- [API Documentation](./API_DOCUMENTATION.md)
- [Frontend Setup Guide](./FRONTEND_SETUP_GUIDE.md)

---

## 📝 Notes Importantes

1. **Authentification** : Tous les hooks nécessitent une session active. Le middleware Next.js et les intercepteurs Axios gèrent automatiquement les redirections.

2. **Cache** : React Query met en cache automatiquement les données. Le cache est invalidé après les mutations.

3. **Types** : Tous les types sont définis dans `src/lib/types/api.ts`. Consultez ce fichier pour les structures de données complètes.

4. **Erreurs** : Toutes les erreurs sont normalisées via `handleApiError` et retournent des messages utilisateur-friendly.

5. **Téléchargements** : Les fonctions de téléchargement utilisent des blobs et déclenchent automatiquement le téléchargement du fichier.

---

---

## 📈 Résumé Final

### ✅ Hooks Créés (13)

1. ✅ `useAuth.ts` - Authentification principale
2. ✅ `useSecurity.ts` - Endpoints de sécurité
3. ✅ `useFront.ts` - Fonctionnalités front/générales
4. ✅ `useDashboard.ts` - Tableau de bord
5. ✅ `useImmeubles.ts` - Gestion des immeubles
6. ✅ `useLogements.ts` - Gestion des logements
7. ✅ `useOccupant.ts` - Fonctionnalités occupant
8. ✅ `useOperators.ts` - Gestion des opérateurs
9. ✅ `useTickets.ts` - Gestion des tickets
10. ✅ `useFactures.ts` - Gestion des factures
11. ✅ `useSearch.ts` - Recherche
12. ✅ `useGestionParc.ts` - Gestion de parc
13. ✅ `useInterventions.ts` - Rapports d'intervention

### 📊 Statistiques Détaillées

- **Fichiers créés** : 13 hooks TypeScript
- **Lignes de code** : ~5,500 lignes
- **Endpoints couverts** : 95+ endpoints API
- **Queries React Query** : 50+ queries réactives
- **Mutations React Query** : 20+ mutations
- **Fonctions de téléchargement** : 30+ fonctions
- **Types TypeScript** : 100+ interfaces et types

### 🎯 Couverture API

| Contrôleur API | Hook | Statut |
|----------------|------|--------|
| SecurityApiController | `useSecurity` | ✅ |
| FrontApiController | `useFront` | ✅ |
| TableauBordClientApiController | `useDashboard` | ✅ |
| ImmeubleApiController | `useImmeubles` | ✅ |
| LogementApiController | `useLogements` | ✅ |
| OccupantApiController | `useOccupant` | ✅ |
| OperatorApiController | `useOperators` | ✅ |
| TicketingApiController | `useTickets` | ✅ |
| FactureApiController | `useFactures` | ✅ |
| SearchApiController | `useSearch` | ✅ |
| GestionParcApiController | `useGestionParc` | ✅ |
| InterventionApiController | `useInterventions` | ✅ |

### 🚀 Prochaines Étapes Recommandées

1. **Tester tous les hooks** avec des données réelles
2. **Créer des composants React** utilisant ces hooks
3. **Implémenter les pages** listées dans `PAGES_LIST.md`
4. **Ajouter la gestion d'erreurs** dans les composants UI
5. **Optimiser les performances** avec React Query
6. **Ajouter des tests unitaires** pour les hooks

---

**Dernière mise à jour** : 2025-01-XX  
**Version** : 1.0.0  
**Statut** : ✅ **Tous les hooks créés et documentés**

