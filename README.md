# 🐝 BeeCarbonIT (SpaceFlow) — GMAO SaaS & Smart Facility Management v3.5

> Plateforme de Gestion de Maintenance Assistée par Ordinateur (GMAO / CAFM) nouvelle génération, intégrant Digital Twin, IA conversationnelle, maintenance prédictive, facturation multi-tenant Stripe et une application mobile native terrain.

---

## 🏗️ Architecture Globale

```
[📱 Mobile Native (iOS / Android)] ──┐
[🌐 Web App (React 18 + Vite)] ─────┼──▶ [Nginx Reverse Proxy] ──▶ [Backend API (Express 4)] ──┬──▶ [PostgreSQL 16 (Neon)]
[💻 SDK JS / Intégrations API] ─────┘                                                          ├──▶ [Redis 7 (Upstash / BullMQ)]
                                                                                               ├──▶ [Stripe Billing Multi-Tenant]
                                                                                               └──▶ [Google Gemini 1.5 Pro / Flash]
```

---

## 📦 Structure du Monorepo

```
SpaceFlow/
├── apps/
│   ├── frontend/         # Web App React 18 + Vite 5 (Tailwind, Multi-Theme, PWA)
│   ├── backend/          # REST API Express + Prisma + WebSocket + Stripe + Gemini AI
│   └── mobile/           # App Mobile Expo React Native (Offline Queue, Biométrie, Scan QR)
├── packages/
│   ├── database/         # Schéma Prisma partagé & Migrations PostgreSQL
│   └── sdk-js/           # Client SDK JavaScript/TypeScript (@beecarbonit/sdk)
└── docs/                 # Documentation technique, Guides & ADRs
```

---

## 🚀 Fonctionnalités Clés

### 1. 🌐 Web Application (React + Vite)
- **Thème Professionnel** : Bascule instantanée entre **Mode Clair** (`#ffffff`), **Mode Sobre** (`#000000`) et **Système**, sans FOUC et conforme WCAG AA (ratio 21:1).
- **Digital Twin & BIM** : Visualisation IFC 3D et jumeau numérique des bâtiments.
- **Smart Analytics** : Calculs automatiques OEE, MTTR, MTBF et métriques ESG/Carbone.
- **Monétisation Stripe** : Plans SaaS (Free, Starter, Pro, Business, Enterprise), simulateur ROI et portail client.

### 2. 📱 Mobile Application (Expo / React Native)
- **Mode Hors-Ligne (Offline-First)** : File d'attente locale MMKV avec synchronisation automatique en tâche de fond dès le retour du réseau.
- **Scanner QR & Caméra** : Détection et identification immédiate des équipements et ordres de travail.
- **Sécurité Avancée** : Authentification biométrique (Face ID / Empreinte digitale) + 2FA TOTP.
- **Capture Terrain** : Création de tickets avec photos compressées et coordonnées GPS.

### 3. 🤖 Moteur IA & Prédictif (Gemini 1.5)
- **Assistant Conversationnel** : Agent conversationnel multi-tenant avec *Function Calling* pour interroger les tickets, équipements et KPIs.
- **Auto-Catégorisation** : Classification automatique de la criticité et des pannes (Gemini Flash).

---

## 🛠️ Démarrage Rapide

### Prérequis
- Node.js >= 18.x
- Docker & Docker Compose (pour dev local PostgreSQL / Redis)
- Expo CLI (`npm install -g eas-cli`)

### Installation
```bash
# 1. Cloner le repository
git clone https://github.com/beniich/SpaceFlow.git
cd SpaceFlow

# 2. Configurer les variables d'environnement
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env

# 3. Installer les dépendances
npm install

# 4. Générer le client Prisma
npm run db:generate --workspace=@BeeCarbonat/database

# 5. Démarrer en mode développement
# Web Frontend : http://localhost:3000 (ou 5173)
# Backend API   : http://localhost:5000
npm run dev
```

### Démarrer l'App Mobile
```bash
cd apps/mobile
npx expo start
# Scanner le QR code avec l'application Expo Go (iOS ou Android)
```

---

## 📚 Documentation Technique

* [ADR-0006 : Application Mobile Expo](docs/adr/0006-mobile-app.md)
* [Documentation GMAO Industrielle](GMAO_DOCS.md)
* [Architecture Système](ARCHITECTURE.md)
* [Feuille de Route & Roadmap](docs/ROADMAP.md)

---

## 📄 Licence
Propriétaire — BeeCarbonIT. Tous droits réservés.
