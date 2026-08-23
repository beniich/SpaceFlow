# 🚀 ReclamTrack - GMAO Industrielle v3.0

> Application de gestion des réclamations transformée en système GMAO complet (Gestion de Maintenance Assistée par Ordinateur).

## 📦 Structure

## Stack technique

- **Base de données** : PostgreSQL 16 (Neon serverless en prod, Docker local en dev)
- **ORM** : Prisma 5
- **Cache / Queue** : Redis 7 + BullMQ
- **Backend** : Express.js 4 (monolithique)
- **Frontend** : React 18 + Vite 5 (SPA)

## Architecture

L'application suit un modèle **monolithique modulaire** :

```
┌─────────────┐      ┌──────────────────┐
│   Nginx     │─────▶│  Frontend (SPA)  │
│   :443      │      │  React + Vite    │
└─────────────┘      └──────────────────┘
       │
       │ /api/
       ▼
┌─────────────┐      ┌──────────────────┐
│  Backend    │─────▶│  PostgreSQL 16   │
│  Express    │      │  (Neon/Docker)   │
│  :5000      │      └──────────────────┘
└─────────────┘      ┌──────────────────┐
       │────────────▶│  Redis 7         │
                     │  (BullMQ)        │
                     └──────────────────┘
```

## 🚀 Démarrage Rapide

### Installation

# 1. Cloner
git clone https://github.com/yourorg/beecarbon.git
cd beecarbon

# 2. Configurer
cp .env.example .env
# Éditer .env avec vos valeurs

# 3. Installer
npm install
npm run build -w @beecarbonit/database

# 4. Lancer (dev)
docker compose up -d postgres redis
cd apps/backend && npm run dev
cd apps/frontend && npm run dev

# 5. Lancer (prod)
docker compose up -d

## Architecture microservices (future)

Le dossier `_archive/microservices/` contient des stubs pour une future
décomposition en microservices. Actuellement, le monolithe Express gère
l'ensemble des routes.

---

## 🏗️ Rappel des Phases de Transformation (v3.0)

1.  **Asset Management** : Hiérarchie complète des équipements.
2.  **Work Orders** : Gestion des interventions correctives et préventives.
3.  **Preventive Maintenance** : Calendriers Gantt et gammes opératoires.
4.  **Inventory MRO** : Gestion du stock de pièces critiques.
5.  **Industrial Analytics** : Dashboard OEE, MTBF et MTTR.
6.  **Tech Portal** : Interface mobile avec scan QR Code.
7.  **Smart Flow** : Conversion automatique Ticket -> Ordre de Travail.
8.  **Digital Twin** : Lien interactif entre schémas techniques et maintenance.

---

## 📚 Documentation

- [GMAO_DOCS.md](GMAO_DOCS.md) - Documentation Maintenance Industrielle exhaustive
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture détaillée
- [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) - Guide d'intégration

## ⚙️ Configuration

### Backend (.env)

```env
PORT=5000
DATABASE_URL=postgresql://localhost:5432/beecarbon
JWT_SECRET=your_secret_key
```

---

## 🌍 Déploiement en Production (Docker & HTTPS)

L'application est prête à être déployée en production à l'aide de **Docker Compose**. La configuration inclut un reverse proxy **Nginx** et la génération automatique de certificats SSL/HTTPS via **Certbot (Let's Encrypt)**.

### 1. Préparation de l'environnement

Copiez le modèle de configuration pour la production et remplissez vos secrets :

```bash
cp .env.production .env
```

Éditez le fichier `nginx/default.conf` pour remplacer `localhost` par votre véritable nom de domaine (ex: `votre-domaine.com`).
Modifiez également `NEXT_PUBLIC_API_URL` dans le `docker-compose.yml` (service `frontend`) avec l'URL de votre API.
Éditez le fichier `nginx/default.conf` pour remplacer `localhost` par votre véritable nom de domaine (ex: `reclamtrack.ricecloud.net`).
Assurez-vous que votre domaine pointe bien vers l'IP de votre serveur.

Ensuite, lancez la stack :

```bash
docker-compose up -d --build
```

Puis générez le certificat :

```bash
docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d reclamtrack.ricecloud.net --email contact@reclamtrack.ricecloud.net --agree-tos --no-eff-email
```

Une fois le certificat généré, décommentez la section HTTPS dans `nginx/default.conf` et redémarrez Nginx :

```bash
docker-compose restart nginx
```

L'application est désormais sécurisée et Certbot renouvellera automatiquement le certificat SSL !

---

## 📝 Changelog

### v3.0.0 (GMAO Update) - 2026-04-14

- ✅ Intégration complète du module GMAO Industriel.
- ✅ Jumeau numérique interactif dans le Design Studio.
- ✅ Conversion automatique Flux Complaint -> OT.

### v1.0.0 - 2026-02-12

- ✅ Systèmes Roster et Audit Guards.
