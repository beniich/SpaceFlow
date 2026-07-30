# 🏗️ Architecture ReclamTrack - Vue d'Ensemble

> **Dernière mise à jour** : 2026-02-12  
> **Version** : 1.0  
> **Auteur** : Équipe ReclamTrack

## 📦 Structure Multi-Projets

Le dépôt ReclamTrack héberge **4 applications** dans une architecture mono-repo :

```
reclamtrack/
├─ frontend/           # 🌐 Application principale Next.js (Port 3000)
├─ backend/            # ⚙️  API REST Node.js/Express (Port 5000)
├─ rosterflow/         # 📅 Module de gestion de planning (Port 3005)
└─ audit-logs-app/     # 📊 Dashboard de logs d'audit (Port 3010)
```

## 🎯 Objectif de chaque projet

### 1. **Frontend** (ReclamTrack Core)
- **Framework** : Next.js 15.1.12 (Pages Router)
- **Port** : 3000
- **Rôle** : Interface principale de gestion des réclamations
- **Fonctionnalités** :
  - Gestion des réclamations citoyennes
  - Dashboard analytique
  - Cartographie interactive (Leaflet)
  - Système d'authentification et rôles
  - Module de planification (calendrier)

### 2. **Backend** (ReclamTrack API)
- **Framework** : Express.js (TypeScript)
- **Port** : 5000
- **Rôle** : API REST pour gérer les données
- **Fonctionnalités** :
  - Authentification JWT
  - CRUD pour réclamations, utilisateurs, etc.
  - WebSocket (Socket.io) pour notifications temps réel
  - Intégration MongoDB

### 3. **RosterFlow** (Module Planning)
- **Framework** : Node.js/Express + Alpine.js
- **Port** : 3005
- **Rôle** : Gestion des plannings d'équipe
- **Status** : ⚠️ **Projet de démonstration** - Peut être intégré dans ReclamTrack Core

### 4. **AuditGuard** (Dashboard Audit)
- **Framework** : Next.js 16.1.6 (App Router)
- **Port** : 3010 (corrigé pour éviter conflit)
- **Rôle** : Suivi des logs d'audit système
- **Status** : ⚠️ **Projet de démonstration** - Peut être intégré dans ReclamTrack Core

## 🔌 Ports Assignés

| Application | Port Local | Port Production |
|-------------|------------|-----------------|
| Frontend    | 3000       | 80 / 443        |
| Backend     | 5000       | 5000            |
| RosterFlow  | 3005       | N/A (Demo)      |
| AuditGuard  | 3010       | N/A (Demo)      |

## 🚀 Commandes Centralisées

Depuis la **racine du projet** :

```bash
# Installation de toutes les dépendances
npm run install:all

# Développement (Frontend + Backend)
npm run dev

# Développement individuel
npm run dev:frontend    # Lance seulement le frontend
npm run dev:backend     # Lance seulement le backend
npm run dev:rosterflow  # Lance RosterFlow (port 3005)
npm run dev:audit       # Lance AuditGuard (port 3010)

# Build production
npm run build       # Frontend + Backend
npm run build:all   # Tous les projets (inclut AuditGuard)

# Lancement production
npm run start
```

## 🔄 Workflow de Développement

### 1. Installation initiale
```bash
git clone [repo-url]
cd reclamtrack
npm run install:all
```

### 2. Configuration
Copier `.env.example` → `.env` dans `/frontend` et `/backend`

### 3. Lancement
```bash
npm run dev  # Lance frontend (3000) + backend (5000)
```

### 4. Accès
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000/api
- **RosterFlow** : http://localhost:3005
- **AuditGuard** : http://localhost:3010

## 📁 Organisation des Dossiers

### Frontend
```
frontend/
├─ src/
│  ├─ app/           # Pages Next.js
│  ├─ components/    # Composants réutilisables
│  ├─ hooks/         # Custom hooks
│  ├─ lib/           # Utilitaires
│  ├─ store/         # État global (Zustand)
│  └─ types/         # Types TypeScript
├─ public/           # Assets statiques
└─ package.json
```

### Backend
```
backend/
├─ src/
│  ├─ controllers/   # Logique métier
│  ├─ models/        # Modèles Mongoose
│  ├─ routes/        # Définition des routes
│  ├─ middleware/    # Middleware Express
│  └─ utils/         # Utilitaires
└─ package.json
```

## 🔐 Sécurité

- **Authentification** : JWT avec refresh tokens
- **Validation** : express-validator (backend) + Zod (frontend)
- **Rate Limiting** : express-rate-limit
- **Headers sécurisés** : Helmet
- **XSS Protection** : xss-clean

## 📊 Technologies Clés

### Frontend
- Next.js 15, React 19, TypeScript
- TailwindCSS, Framer Motion
- Leaflet (cartes), Recharts (graphiques)
- React Query, Zustand
- Socket.io-client

### Backend
- Express, TypeScript
- MongoDB (Mongoose)
- Socket.io
- Winston (logs)

## ⚠️ Recommandations

### Pour RosterFlow et AuditGuard
Ces projets sont actuellement **autonomes**. Options :

1. **Option A (Recommandée)** : Intégrer comme modules dans ReclamTrack
   - Déplacer dans `frontend/src/app/(app)/roster` et `frontend/src/app/(app)/audit`
   - Partager l'authentification et le style

2. **Option B** : Garder séparés mais documenter clairement qu'ils sont des démos

3. **Option C** : Archiver dans `/demos` si non utilisés

## 🧪 Tests

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
```

## 📝 Documentation Complète

Voir les fichiers à la racine :
- `README.md` - Introduction
- `QUICKSTART.md` - Guide de démarrage rapide
- `DEPLOYMENT.md` - Guide de déploiement
- `CONTRIBUTING.md` - Guide de contribution
