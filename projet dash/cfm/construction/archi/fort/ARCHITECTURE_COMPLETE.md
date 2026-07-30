# 🏗️ Architecture Complète - ReclamTrack 3.0

> **Version**: 3.0  
> **Dernière mise à jour**: 2026-02-17  
> **Type**: Application Web Full-Stack Multi-Tenant  
> **Équipe**: ReclamTrack Dev Team

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#-vue-densemble)
2. [Architecture Technique](#-architecture-technique)
3. [Stack Technologique](#-stack-technologique)
4. [Structure du Projet](#-structure-du-projet)
5. [Architecture Backend](#-architecture-backend)
6. [Architecture Frontend](#-architecture-frontend)
7. [Base de Données](#-base-de-données)
8. [Microservices & Kafka](#-microservices--kafka)
9. [Sécurité](#-sécurité)
10. [Monitoring & Observabilité](#-monitoring--observabilité)
11. [Flux de Données](#-flux-de-données)
12. [Déploiement](#-déploiement)

---

## 🎯 Vue d'Ensemble

### Objectif

**ReclamTrack** est une plateforme de **gestion des réclamations citoyennes** multi-tenant permettant aux municipalités et organisations de gérer efficacement les demandes des citoyens.

### Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        UTILISATEURS                              │
│  (Citoyens, Agents, Managers, Admins, Super-Admins)            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                         │
│  • Pages & Components React                                      │
│  • State Management (Zustand)                                    │
│  • Real-time (Socket.IO)                                         │
│  • i18n (Français/Arabe)                                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API GATEWAY (Port 5001)                        │
│  • Routage des Requêtes                                          │
│  • Load Balancing                                                │
│  • Authentication Proxy                                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
┌─────────────────────┐          ┌────────────────────────┐
│  BACKEND MONOLITH   │          │   MICROSERVICES        │
│  (Express.js)       │          │   (Kafka-based)        │
│  Port 5009          │          │   Ports 3001-3006      │
│                     │          │                        │
│  • RESTful API      │          │  • Auth Service        │
│  • Business Logic   │          │  • Complaints Service  │
│  • Socket.IO        │          │  • Teams Service       │
│  • File Uploads     │          │  • Notifications       │
│  • JWT Auth         │          │  • Analytics           │
│                     │          │  • Inventory           │
└─────────┬───────────┘          └────────┬───────────────┘
          │                               │
          │         ┌─────────────────────┘
          ▼         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    KAFKA MESSAGE BROKER                          │
│  • Event Streaming                                               │
│  • Saga Orchestration                                            │
│  • Async Communication                                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB (Database)                            │
│  • Collections: Users, Organizations, Complaints, Teams, etc.    │
│  • Indexes optimisés                                             │
│  • Multi-tenant data isolation                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              MONITORING & OBSERVABILITY                          │
│  • Prometheus (Métriques)                                        │
│  • Grafana (Visualisation)                                       │
│  • Winston Logs                                                  │
│  • Kafka UI                                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Architecture Technique

### Type d'Architecture

**Hybride Monolithe + Microservices**

- **Monolithe Backend Principal** : Gère la majorité des opérations CRUD et logique métier
- **Microservices** : Services spécialisés pour fonctionnalités critiques et scalabilité
- **Event-Driven** : Communication asynchrone via Kafka

### Caractéristiques Clés

| Caractéristique          | Description                                   |
| ------------------------ | --------------------------------------------- |
| **Multi-tenant**         | Isolation des données par organisation        |
| **Real-time**            | WebSocket (Socket.IO) pour notifications      |
| **Scalable**             | Microservices + Kafka pour scaling horizontal |
| **Sécurisé**             | JWT, RBAC, Helmet, rate limiting              |
| **Internationalisation** | Support FR/AR avec next-intl                  |
| **Progressive**          | PWA-ready avec offline capabilities           |

---

## 💻 Stack Technologique

### Frontend Stack

```typescript
{
  "framework": "Next.js 15.1.12",
  "runtime": "React 19.0.0",
  "language": "TypeScript 5.7.3",
  "styling": {
    "framework": "TailwindCSS 3.4.17",
    "animations": "Framer Motion 12.0.6",
    "ui": "Radix UI + Shadcn/ui"
  },
  "stateManagement": {
    "global": "Zustand 5.0.11",
    "server": "TanStack Query 5.90.21",
    "forms": "React Hook Form 7.50.0"
  },
  "i18n": "next-intl 4.8.2",
  "realtime": "Socket.IO Client 4.8.3",
  "maps": "React Leaflet 5.0.0",
  "charts": "Recharts 3.7.0",
  "calendar": "FullCalendar 6.1.20",
  "auth": "@react-oauth/google 0.13.4",
  "testing": "Playwright 1.58.2"
}
```

### Backend Stack

```typescript
{
  "framework": "Express.js 4.18.2",
  "runtime": "Node.js",
  "language": "TypeScript 5.7.3",
  "database": {
    "primary": "MongoDB 8.1.0 (Mongoose)",
    "type": "NoSQL Document Store"
  },
  "auth": {
    "jwt": "jsonwebtoken 9.0.2",
    "oauth": "google-auth-library 10.5.0",
    "encryption": "bcryptjs 2.4.3"
  },
  "realtime": "Socket.IO 4.8.3",
  "messaging": "KafkaJS 2.2.4",
  "validation": "express-validator 7.3.1",
  "security": {
    "helmet": "8.1.0",
    "cors": "2.8.6",
    "rateLimit": "express-rate-limit 8.2.1",
    "xss": "xss-clean 0.1.4"
  },
  "logging": "Winston 3.19.0",
  "email": "Nodemailer 6.9.13",
  "payments": "Stripe 20.3.1",
  "uploads": "Multer 2.0.2"
}
```

### Infrastructure & DevOps

```yaml
Containerization: Docker + Docker Compose
CI/CD: GitHub Actions
Monitoring:
  - Prometheus (Métriques)
  - Grafana (Dashboards)
  - Node Exporter (System metrics)
Message Broker: Apache Kafka + Zookeeper
Schema Registry: Confluent Schema Registry
Kafka UI: Provectus Kafka UI
Reverse Proxy: (à définir - Nginx/Traefik)
```

---

## 📁 Structure du Projet

### Arborescence Racine

```
reclamtrack/
├── 📂 .github/
│   └── workflows/          # GitHub Actions CI/CD
│       └── integration.yml
├── 📂 backend/            # API Backend (Express)
├── 📂 frontend/           # Application Next.js
├── 📂 shared/             # Types partagés
├── 📂 microservices/      # Microservices Kafka
│   ├── api-gateway/
│   ├── auth-service/
│   ├── complaints-service/
│   ├── teams-service/
│   ├── notification-service/
│   ├── analytics-service/
│   └── inventory-service/
├── 📂 monitoring/         # Configuration monitoring
│   ├── prometheus.yml
│   └── grafana/
├── 📂 scripts/            # Scripts utilitaires
├── 📂 _archive/           # Code archivé
├── 📄 docker-compose.yml  # Orchestration Docker
├── 📄 package.json        # Scripts workspace
└── 📄 README.md
```

---

## ⚙️ Architecture Backend

### Structure Backend

```
backend/
├── src/
│   ├── config/           # Configuration (DB, env)
│   │   ├── db.ts
│   │   └── envValidator.ts
│   │
│   ├── controllers/      # Logique métier (slim)
│   │   └── (à développer)
│   │
│   ├── models/           # Modèles Mongoose (18 modèles)
│   │   ├── User.ts
│   │   ├── Organization.ts
│   │   ├── Complaint.ts
│   │   ├── Team.ts
│   │   ├── Assignment.ts
│   │   ├── Intervention.ts
│   │   ├── Membership.ts
│   │   ├── AuditLog.ts
│   │   ├── Feedback.ts
│   │   ├── Knowledge.ts
│   │   ├── Message.ts
│   │   ├── PlanningSlot.ts
│   │   ├── Requisition.ts
│   │   ├── Roster.ts
│   │   ├── Scheduler.ts
│   │   ├── Staff.ts
│   │   ├── Vehicle.ts
│   │   └── Leave.ts
│   │
│   ├── routes/           # Définitions API REST (26 routes)
│   │   ├── auth.ts              # POST /api/auth/login, /register
│   │   ├── googleAuth.ts        # Google OAuth
│   │   ├── organizations.ts     # CRUD organizations
│   │   ├── memberships.ts       # Gestion membres
│   │   ├── complaints.ts        # CRUD réclamations
│   │   ├── teams.ts             # Gestion équipes
│   │   ├── assignments.ts       # Attribution équipes
│   │   ├── interventions.ts     # Suivi interventions
│   │   ├── planning.ts          # Planification
│   │   ├── scheduler.ts         # Calendrier
│   │   ├── dashboard.ts         # Stats dashboard
│   │   ├── analytics.ts         # Analytique avancée
│   │   ├── inventory.ts         # Gestion stock
│   │   ├── fleet.ts             # Gestion véhicules
│   │   ├── messages.ts          # Messagerie
│   │   ├── knowledge.ts         # Base connaissances
│   │   ├── feedback.ts          # Retours utilisateurs
│   │   ├── audit.ts             # Logs d'audit
│   │   ├── admin.ts             # Admin features
│   │   ├── staff.ts             # Gestion personnel
│   │   ├── roster.ts            # Planning équipes
│   │   ├── leave.ts             # Gestion congés
│   │   ├── members.ts           # Membres orgs
│   │   ├── billing.ts           # Facturation
│   │   ├── db.ts                # Admin DB
│   │   └── upload.ts            # Upload fichiers
│   │
│   ├── middleware/       # Middleware Express
│   │   ├── auth.ts              # Vérification JWT
│   │   ├── orgContext.ts        # Contexte organisation
│   │   ├── rateLimiter.ts       # Rate limiting
│   │   ├── validator.ts         # Validation inputs
│   │   └── errorHandler.ts      # Gestion erreurs
│   │
│   ├── services/         # Services métier
│   │   ├── socketService.ts     # WebSocket real-time
│   │   ├── sagaConsumer.ts      # Kafka consumer
│   │   ├── emailService.ts      # Envoi emails
│   │   ├── stripeService.ts     # Paiements
│   │   └── (autres services)
│   │
│   ├── utils/            # Utilitaires
│   │   └── logger.ts            # Winston logger
│   │
│   ├── scripts/          # Scripts (seed, migrations)
│   │   ├── seed.ts
│   │   └── verify-login.ts
│   │
│   └── index.ts          # Point d'entrée
│
├── uploads/              # Fichiers uploadés
├── package.json
├── tsconfig.json
└── Dockerfile
```

### Points d'Entrée API Principaux

| Endpoint             | Méthode                | Description           |
| -------------------- | ---------------------- | --------------------- |
| `/`                  | GET                    | Health check          |
| `/api/auth/login`    | POST                   | Connexion utilisateur |
| `/api/auth/register` | POST                   | Inscription           |
| `/api/auth/google`   | POST                   | OAuth Google          |
| `/api/organizations` | GET, POST              | Gestion organisations |
| `/api/complaints`    | GET, POST, PUT, DELETE | CRUD réclamations     |
| `/api/teams`         | GET, POST              | Gestion équipes       |
| `/api/dashboard`     | GET                    | Statistiques          |
| `/api/analytics/*`   | GET                    | Analytics avancée     |
| `/api/upload`        | POST                   | Upload fichiers       |

### Middleware Pipeline

```
Request
  ↓
[Helmet] → Sécurité headers
  ↓
[CORS] → Configuration CORS
  ↓
[Rate Limiter] → Limite requêtes
  ↓
[Body Parser] → Parse JSON/urlencoded
  ↓
[Auth Middleware] → Vérification JWT (si protégé)
  ↓
[Org Context] → Injection contexte organisation
  ↓
[Validator] → Validation input
  ↓
[Route Handler] → Logique métier
  ↓
[Error Handler] → Gestion erreurs
  ↓
Response
```

---

## 🎨 Architecture Frontend

### Structure Frontend

```
frontend/
├── src/
│   ├── app/                    # App Router Next.js 15
│   │   ├── layout.tsx          # Root layout
│   │   ├── [locale]/           # Routes i18n
│   │   │   ├── (auth)/         # Groupe auth (non-protégé)
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   │
│   │   │   ├── (app)/          # Groupe app (protégé)
│   │   │   │   ├── dashboard/
│   │   │   │   ├── analytics/
│   │   │   │   ├── feedback/
│   │   │   │   ├── fleet/
│   │   │   │   ├── knowledge/
│   │   │   │   ├── map/
│   │   │   │   ├── messages/
│   │   │   │   ├── planning/
│   │   │   │   ├── reports/
│   │   │   │   ├── roster/
│   │   │   │   ├── settings/
│   │   │   │   ├── teams/
│   │   │   │   └── technician/
│   │   │   │
│   │   │   ├── (public)/       # Pages publiques
│   │   │   │   ├── page.tsx
│   │   │   │   ├── pricing/
│   │   │   │   ├── services/
│   │   │   │   ├── checkout/
│   │   │   │   └── system-info/
│   │   │   │
│   │   │   ├── admin/          # Admin section
│   │   │   │   ├── monitoring/
│   │   │   │   ├── devops/     # 11 dashboards DevOps
│   │   │   │   │   ├── trace/
│   │   │   │   │   ├── logs/
│   │   │   │   │   ├── metrics/
│   │   │   │   │   ├── kubernetes/
│   │   │   │   │   ├── docker/
│   │   │   │   │   ├── database/
│   │   │   │   │   ├── api/
│   │   │   │   │   ├── security/
│   │   │   │   │   ├── performance/
│   │   │   │   │   ├── errors/
│   │   │   │   │   └── drift/
│   │   │   │   ├── communication/
│   │   │   │   └── teams/
│   │   │   │
│   │   │   ├── admin-db/       # Admin base de données
│   │   │   ├── audit-logs/     # Logs d'audit
│   │   │   ├── debug/          # Debug tools
│   │   │   ├── org-select/     # Sélection organisation
│   │   │   └── roster-scheduler/ # Planification avancée
│   │   │
│   │   └── api/                # API Routes (si nécessaire)
│   │       └── auth/
│   │
│   ├── components/             # Composants réutilisables (120+ composants)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ComplaintForm.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── PlanningCalendar.tsx
│   │   ├── TeamCard.tsx
│   │   ├── NotificationToast.tsx
│   │   │
│   │   ├── ui/                 # Composants UI Shadcn (32 composants)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   │
│   │   ├── admin-db/           # Composants admin DB
│   │   ├── audit/              # Composants audit
│   │   ├── auth/               # Composants auth
│   │   ├── complaints/         # Composants réclamations
│   │   ├── dashboard-v2/       # Dashboard moderne
│   │   ├── devops-dashboards/  # 12 dashboards DevOps
│   │   ├── feedback/           # Composants feedback
│   │   ├── inventory/          # Composants inventaire
│   │   ├── layout/             # Composants layout
│   │   ├── maps/               # Composants cartes
│   │   ├── notifications/      # Composants notifs
│   │   ├── organization/       # Composants org
│   │   ├── planning/           # Composants planning
│   │   ├── requisitions/       # Composants réquisitions
│   │   ├── roster-scheduler/   # Composants roster
│   │   ├── services/           # Composants services
│   │   └── shared/             # Composants partagés
│   │
│   ├── lib/                    # Bibliothèques & utils (18 fichiers)
│   │   ├── api.ts              # Client API Axios
│   │   ├── socket.ts           # Client Socket.IO
│   │   ├── auth.ts             # Helpers auth
│   │   ├── utils.ts            # Utilitaires
│   │   ├── cn.ts               # Class merge
│   │   └── ...
│   │
│   ├── store/                  # State Management Zustand (5 stores)
│   │   ├── authStore.ts        # État authentification
│   │   ├── organizationStore.ts # État organisation
│   │   ├── notificationStore.ts # État notifications
│   │   ├── complaintStore.ts   # État réclamations
│   │   └── uiStore.ts          # État UI
│   │
│   ├── hooks/                  # Custom Hooks (12 hooks)
│   │   ├── useAuth.ts
│   │   ├── useOrganization.ts
│   │   ├── useSocket.ts
│   │   ├── useNotifications.ts
│   │   ├── useComplaints.ts
│   │   └── ...
│   │
│   ├── types/                  # TypeScript Types
│   │   ├── index.ts
│   │   ├── complaint.ts
│   │   └── user.ts
│   │
│   ├── i18n/                   # Internationalisation
│   │   ├── request.ts
│   │   └── (messages FR/AR)
│   │
│   ├── providers/              # React Providers
│   │   ├── AuthProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── SocketProvider.tsx
│   │
│   ├── styles/                 # Styles globaux
│   │   └── globals.css
│   │
│   └── middleware.ts           # Next.js Middleware (auth routing)
│
├── public/                     # Assets statiques
│   ├── images/
│   ├── icons/
│   └── locales/
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── Dockerfile
```

### Pages Principales (30+ pages)

#### Pages Publiques

- `/` - Landing page
- `/pricing` - Tarification
- `/services` - Services offerts
- `/checkout` - Paiement
- `/system-info` - Informations système

#### Pages Authentification

- `/login` - Connexion
- `/register` - Inscription

#### Pages Application (Protégées)

- `/dashboard` - Dashboard principal
- `/analytics` - Analytique avancée
- `/map` - Carte interactive des réclamations
- `/feedback` - Retours utilisateurs
- `/fleet` - Gestion de flotte
- `/knowledge` - Base de connaissances
- `/messages` - Messagerie
- `/planning` - Planification
- `/reports` - Rapports
- `/roster` - Planning d'équipe
- `/settings` - Paramètres
- `/teams` - Gestion d'équipes
- `/technician` - Vue technicien
- `/audit-logs` - Logs d'audit

#### Pages Admin

- `/admin/monitoring` - Monitoring Grafana
- `/admin/devops` - 11 dashboards DevOps
- `/admin/communication` - Communication
- `/admin/teams` - Administration équipes
- `/admin-db` - Administration base de données

#### Pages Utilitaires

- `/debug` - Outils de debug
- `/org-select` - Sélection organisation
- `/roster-scheduler` - Planificateur avancé

### Routing et Middleware

```typescript
// middleware.ts - Protection des routes
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Routes publiques
  if (pathname.startsWith("/(public)")) return NextResponse.next();

  // Routes protégées
  if (!token && pathname.startsWith("/(app)")) {
    return NextResponse.redirect("/login");
  }

  // Routes admin
  if (pathname.startsWith("/admin") && !isAdmin(token)) {
    return NextResponse.redirect("/dashboard");
  }

  return NextResponse.next();
}
```

### State Management Architecture

```typescript
// Zustand Store Example
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  organization: Organization | null;

  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
  setOrganization: (org: Organization) => void;
}

// React Query pour server state
const { data, isLoading } = useQuery({
  queryKey: ["complaints", filters],
  queryFn: () => fetchComplaints(filters),
});
```

---

## 🗄️ Base de Données

### MongoDB Collections (18 Collections)

```
MongoDB: reclamtrack
│
├── users                  # Utilisateurs
│   ├── _id
│   ├── email
│   ├── password (hashed)
│   ├── role (citizen, agent, manager, admin, superadmin)
│   ├── organizationId
│   └── profile
│
├── organizations          # Organisations/Municipalités
│   ├── _id
│   ├── name
│   ├── type (municipality, company)
│   ├── settings
│   ├── subscription
│   └── billing
│
├── memberships            # Affiliations utilisateur-org
│   ├── _id
│   ├── userId
│   ├── organizationId
│   ├── role
│   └── permissions
│
├── complaints             # Réclamations citoyennes
│   ├── _id
│   ├── organizationId     # Multi-tenant
│   ├── citizenId
│   ├── title
│   ├── description
│   ├── category
│   ├── priority
│   ├── status
│   ├── location (GeoJSON)
│   ├── assignedTeamId
│   ├── attachments[]
│   └── timestamps
│
├── teams                  # Équipes d'intervention
│   ├── _id
│   ├── organizationId
│   ├── name
│   ├── specialty
│   ├── members[]
│   └── availability
│
├── assignments            # Attributions équipe-réclamation
│   ├── _id
│   ├── complaintId
│   ├── teamId
│   ├── assignedBy
│   └── assignedAt
│
├── interventions          # Interventions terrain
│   ├── _id
│   ├── complaintId
│   ├── teamId
│   ├── status
│   ├── checkIn/checkOut
│   └── report
│
├── planning_slots         # Créneaux de planification
│   ├── _id
│   ├── teamId
│   ├── startTime
│   ├── endTime
│   └── taskId
│
├── schedulers             # Calendrier d'événements
│   ├── _id
│   ├── organizationId
│   ├── title
│   ├── start/end
│   └── attendees[]
│
├── rosters                # Planning d'équipe
│   ├── _id
│   ├── teamId
│   ├── date
│   └── shifts[]
│
├── leaves                 # Demandes de congé
│   ├── _id
│   ├── userId
│   ├── startDate
│   ├── endDate
│   └── status
│
├── vehicles               # Flotte de véhicules
│   ├── _id
│   ├── organizationId
│   ├── registration
│   ├── type
│   └── maintenance[]
│
├── requisitions           # Réquisitions de matériel
│   ├── _id
│   ├── organizationId
│   ├── items[]
│   ├── status
│   └── requestedBy
│
├── messages               # Messagerie interne
│   ├── _id
│   ├── senderId
│   ├── recipientId
│   ├── content
│   └── timestamp
│
├── knowledge              # Base de connaissances
│   ├── _id
│   ├── organizationId
│   ├── title
│   ├── content
│   └── category
│
├── feedback               # Retours utilisateurs
│   ├── _id
│   ├── userId
│   ├── type
│   ├── message
│   └── rating
│
├── audit_logs             # Logs d'audit
│   ├── _id
│   ├── organizationId
│   ├── userId
│   ├── action
│   ├── resource
│   ├── timestamp
│   └── metadata
│
└── staff                  # Personnel (si différent de users)
    ├── _id
    ├── organizationId
    ├── position
    └── department
```

### Indexes Recommandés

```javascript
// Optimisations performances
db.complaints.createIndex({ organizationId: 1, status: 1 });
db.complaints.createIndex({ location: "2dsphere" }); // Geo queries
db.users.createIndex({ email: 1 }, { unique: true });
db.organizations.createIndex({ name: 1 });
db.audit_logs.createIndex({ organizationId: 1, timestamp: -1 });
```

### Schéma Multi-Tenant

```typescript
// Chaque document contient organizationId
interface BaseDocument {
  _id: ObjectId;
  organizationId: ObjectId; // Clé d'isolation
  createdAt: Date;
  updatedAt: Date;
}

// Middleware Mongoose pour isolation automatique
schema.pre("find", function () {
  if (this.options.organizationId) {
    this.where({ organizationId: this.options.organizationId });
  }
});
```

---

## 🔀 Microservices & Kafka

### Architecture Event-Driven

```
┌─────────────────────────────────────────────────────────────────┐
│                        KAFKA ECOSYSTEM                           │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────────┐  │
│  │  Zookeeper   │───▶│    Kafka     │◀──▶│ Schema Registry │  │
│  │  Port 2181   │    │  Port 9092   │    │   Port 8081     │  │
│  └──────────────┘    └──────┬───────┘    └─────────────────┘  │
│                              │                                  │
│                              │                                  │
│                    ┌─────────┴──────────┐                      │
│                    │   KAFKA TOPICS     │                      │
│                    │                    │                      │
│                    │  • complaint.created                      │
│                    │  • complaint.assigned                     │
│                    │  • team.notified                          │
│                    │  • intervention.started                   │
│                    │  • notification.sent                      │
│                    └────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
                             │
         ┌───────────────────┼────────────────────┐
         ▼                   ▼                    ▼
┌─────────────────┐  ┌──────────────┐  ┌──────────────────┐
│ Auth Service    │  │ Complaints   │  │ Notification     │
│ Port 3001       │  │ Service      │  │ Service          │
│                 │  │ Port 3002    │  │ Port 3004        │
│ • Login         │  │ • CRUD       │  │ • Email          │
│ • Register      │  │ • Validation │  │ • SMS            │
│ • JWT           │  │ • Geo-tags   │  │ • Push           │
└─────────────────┘  └──────────────┘  └──────────────────┘
         ▼                   ▼                    ▼
┌─────────────────┐  ┌──────────────┐  ┌──────────────────┐
│ Teams Service   │  │ Analytics    │  │ Inventory        │
│ Port 3003       │  │ Service      │  │ Service          │
│                 │  │ Port 3005    │  │ Port 3006        │
│ • Assignment    │  │ • Reporting  │  │ • Stock          │
│ • Availability  │  │ • Metrics    │  │ • Requisitions   │
└─────────────────┘  └──────────────┘  └──────────────────┘
```

### Saga Pattern Example

```typescript
// Workflow: Création et Attribution de Réclamation

// 1. Frontend → Backend Monolith
POST /api/complaints
  ↓
// 2. Backend → Kafka Topic
Topic: complaint.created
Event: {
  complaintId: "123",
  organizationId: "org1",
  location: {...},
  priority: "high"
}
  ↓
// 3. Complaints Service consume event
Complaints Service → Validates & Stores
  ↓
// 4. Publish next event
Topic: complaint.assigned
Event: {
  complaintId: "123",
  teamId: "team5"
}
  ↓
// 5. Teams Service consume
Teams Service → Notifies team
  ↓
// 6. Publish notification event
Topic: notification.sent
Event: {
  teamId: "team5",
  message: "Nouvelle réclamation assignée"
}
  ↓
// 7. Notification Service → Email/SMS
  ↓
// 8. Backend consumes final event → Update DB
Backend → Updates complaint status to "en cours"
  ↓
// 9. Socket.IO → Real-time update to Frontend
WebSocket → Notify dashboard
```

### Microservices Détaillés

| Service                  | Port | Responsabilités              | Topics Consumed                               | Topics Produced                           |
| ------------------------ | ---- | ---------------------------- | --------------------------------------------- | ----------------------------------------- |
| **Auth Service**         | 3001 | Authentication, JWT, OAuth   | -                                             | `user.created`, `user.login`              |
| **Complaints Service**   | 3002 | Gestion réclamations         | `complaint.created`                           | `complaint.assigned`, `complaint.updated` |
| **Teams Service**        | 3003 | Gestion équipes, attribution | `complaint.assigned`                          | `team.notified`                           |
| **Notification Service** | 3004 | Email, SMS, Push             | `team.notified`, `complaint.created`          | `notification.sent`                       |
| **Analytics Service**    | 3005 | Métriques, rapports          | `complaint.updated`, `intervention.completed` | `analytics.generated`                     |
| **Inventory Service**    | 3006 | Gestion stock, matériel      | `requisition.created`                         | `inventory.updated`                       |

### Kafka Configuration

```yaml
# docker-compose.yml excerpt
kafka:
  environment:
    KAFKA_BROKER_ID: 1
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
    KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
    KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

---

## 🔐 Sécurité

### Authentification & Autorisation

#### JWT Flow

```
1. Login (POST /api/auth/login)
   ↓
   Backend valide credentials
   ↓
   Génère JWT token (expiration 7 jours)
   ↓
   Token retourné au Frontend
   ↓
   Frontend stocke dans cookie HttpOnly

2. Requêtes protégées
   ↓
   Frontend envoie token dans header Authorization
   ↓
   Middleware auth.ts vérifie token
   ↓
   Injecte user & org dans req.user
   ↓
   Route handler accède à req.user
```

#### Rôles & Permissions (RBAC)

```typescript
enum UserRole {
  CITIZEN = "citizen", // Peut créer réclamations
  AGENT = "agent", // Peut gérer réclamations assignées
  MANAGER = "manager", // Peut assigner et superviser
  ADMIN = "admin", // Administration organisation
  SUPERADMIN = "superadmin", // Administration plateforme
}

// Middleware exemple
const requireRole = (roles: UserRole[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

// Usage
router.delete(
  "/complaints/:id",
  auth,
  requireRole([UserRole.ADMIN, UserRole.MANAGER]),
  deleteComplaint,
);
```

### Protection Mise en Place

| Couche                  | Protection                | Implémentation                                  |
| ----------------------- | ------------------------- | ----------------------------------------------- |
| **Headers**             | Security headers          | Helmet.js                                       |
| **CORS**                | Origine contrôlée         | `cors({ origin: '*' })` (à restreindre en prod) |
| **Rate Limiting**       | Max 100 req/15min         | express-rate-limit                              |
| **XSS**                 | Nettoyage inputs          | xss-clean                                       |
| **Injection**           | Validation stricte        | express-validator + Zod                         |
| **SQL/NoSQL Injection** | Mongoose sanitization     | Built-in                                        |
| **JWT**                 | Tokens signés             | jsonwebtoken                                    |
| **Passwords**           | Hashing bcrypt            | bcryptjs (10 rounds)                            |
| **HTTPS**               | TLS/SSL                   | À configurer en production                      |
| **Secrets**             | Variables d'environnement | dotenv                                          |

### Validation des Données

```typescript
// Backend: express-validator
import { body, validationResult } from "express-validator";

router.post(
  "/complaints",
  [
    body("title").isString().trim().isLength({ min: 5, max: 200 }),
    body("description").isString().trim().isLength({ min: 10 }),
    body("category").isIn(["voirie", "éclairage", "déchets", "autre"]),
    body("priority").isIn(["basse", "moyenne", "haute", "urgente"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ...
  },
);

// Frontend: Zod + React Hook Form
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const complaintSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  category: z.enum(["voirie", "éclairage", "déchets", "autre"]),
  priority: z.enum(["basse", "moyenne", "haute", "urgente"]),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(complaintSchema),
});
```

### Isolation Multi-Tenant

```typescript
// Middleware orgContext.ts
export const orgContext = async (req, res, next) => {
  const user = req.user; // from auth middleware

  // Récupérer l'organisation de l'utilisateur
  const membership = await Membership.findOne({ userId: user._id });
  if (!membership) {
    return res.status(403).json({ error: "No organization access" });
  }

  // Injecter dans la requête
  req.organizationId = membership.organizationId;
  next();
};

// Utilisation dans routes
router.get("/complaints", auth, orgContext, async (req, res) => {
  // Ne retourne QUE les réclamations de l'org de l'utilisateur
  const complaints = await Complaint.find({
    organizationId: req.organizationId,
  });
  res.json(complaints);
});
```

---

## 📊 Monitoring & Observabilité

### Stack Monitoring

```
┌─────────────────────────────────────────────────────────────────┐
│                    MONITORING ARCHITECTURE                       │
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │   Backend    │────────▶│  Prometheus  │                     │
│  │   Metrics    │  HTTP   │  Port 9090   │                     │
│  │  /metrics    │         │              │                     │
│  └──────────────┘         └──────┬───────┘                     │
│                                   │                              │
│  ┌──────────────┐                │                              │
│  │ Node Export  │────────────────┘                              │
│  │  Port 9100   │  System Metrics                               │
│  └──────────────┘                                               │
│                                   │                              │
│                                   ▼                              │
│                          ┌──────────────┐                       │
│                          │   Grafana    │                       │
│                          │  Port 3001   │                       │
│                          │              │                       │
│                          │  Dashboards: │                       │
│                          │  • System    │                       │
│                          │  • API       │                       │
│                          │  • Kafka     │                       │
│                          │  • Database  │                       │
│                          └──────────────┘                       │
│                                                                  │
│  ┌──────────────────────────────────────────┐                  │
│  │          Winston Logs (Backend)          │                  │
│  │  • info.log                              │                  │
│  │  • error.log                             │                  │
│  │  • Structured JSON                       │                  │
│  └──────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

### Grafana Dashboards

**Accès**: `http://localhost:3001`  
**Credentials**: `admin / reclamtrack2024`

Dashboards disponibles:

1. **System Overview** - CPU, RAM, Disk
2. **API Performance** - Latency, Throughput, Errors
3. **Kafka Metrics** - Topics, Consumers, Lag
4. **Database Metrics** - Queries, Connections, Slow queries

### Logging Strategy

```typescript
// backend/src/utils/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "info.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Usage
logger.info("User logged in", { userId, organizationId });
logger.error("Database connection failed", { error: err.message });
```

### Audit Logs

```typescript
// Enregistrement automatique des actions critiques
async function logAudit(
  action: string,
  userId: string,
  resource: string,
  metadata?: any,
) {
  await AuditLog.create({
    organizationId: req.organizationId,
    userId,
    action, // 'CREATE', 'UPDATE', 'DELETE'
    resource, // 'complaint', 'user', 'team'
    timestamp: new Date(),
    metadata, // Données additionnelles
  });
}

// Exemple d'utilisation
router.delete("/complaints/:id", auth, async (req, res) => {
  const complaint = await Complaint.findByIdAndDelete(req.params.id);
  await logAudit("DELETE", req.user._id, "complaint", {
    complaintId: complaint._id,
  });
  res.json({ success: true });
});
```

### Frontend Monitoring (DevOps Section)

L'application inclut **11 dashboards DevOps** intégrés:

1. **Trace Dashboard** - Distributed tracing
2. **Logs Dashboard** - Centralized logging
3. **Metrics Dashboard** - Application metrics
4. **Kubernetes Dashboard** - K8s cluster status
5. **Docker Dashboard** - Container monitoring
6. **Database Dashboard** - DB performance
7. **API Dashboard** - API analytics
8. **Security Dashboard** - Security events
9. **Performance Dashboard** - Performance metrics
10. **Errors Dashboard** - Error tracking
11. **Drift Dashboard** - Configuration drift

---

## 🔄 Flux de Données

### Flux Complet: Création de Réclamation

```
[Citoyen]
  ↓
  Remplit formulaire sur /map ou /dashboard
  ↓
[Frontend]
  ↓
  complaintStore.createComplaint(data)
  ↓
  api.post('/api/complaints', data)
  ↓
[Backend - Route /api/complaints]
  ↓
  Middleware: auth → orgContext → validator
  ↓
  Validation des données
  ↓
  Complaint.create({ ...data, organizationId })
  ↓
  MongoDB: Insert dans collection 'complaints'
  ↓
  (Optionnel) Publish event "complaint.created" → Kafka
  ↓
[Kafka]
  ↓
  Topic: complaint.created
  ↓
[Complaints Microservice]
  ↓
  Consomme event
  ↓
  Logique métier (ex: attribution automatique)
  ↓
  Publish "complaint.assigned" → Kafka
  ↓
[Teams Microservice]
  ↓
  Consomme "complaint.assigned"
  ↓
  Notifie l'équipe assignée
  ↓
[Notification Microservice]
  ↓
  Envoie email/SMS à l'équipe
  ↓
[Backend]
  ↓
  Consomme "complaint.assigned" (SagaConsumer)
  ↓
  Update complaint.status = "en cours"
  ↓
  Socket.IO: Broadcast notification
  ↓
[Frontend]
  ↓
  Socket listener reçoit notification
  ↓
  notificationStore.addNotification()
  ↓
  Toast affiché + mise à jour UI
  ↓
[Utilisateur]
  ↓
  Voit la réclamation mise à jour en temps réel
```

### Flux Real-Time (WebSocket)

```
[Backend - index.ts]
  ↓
  initSocket(httpServer)
  ↓
  Socket.IO Server écoute sur port 5000

[Frontend - socket.ts]
  ↓
  useEffect(() => socket.connect(), [])
  ↓
  socket.on('notification', handleNotification)

[Backend - Événement]
  ↓
  notificationService.broadcast({
    type: 'success',
    message: 'Nouvelle réclamation assignée'
  })
  ↓
  Tous les clients connectés reçoivent
  ↓
[Frontend]
  ↓
  handleNotification(data)
  ↓
  toast.success(data.message)
```

---

## 🚀 Déploiement

### Environnements

| Environnement   | URL                       | Description          |
| --------------- | ------------------------- | -------------------- |
| **Development** | `localhost:3000`          | Développement local  |
| **Staging**     | `staging.reclamtrack.com` | Tests pré-production |
| **Production**  | `reclamtrack.com`         | Production           |

### Docker Compose

```bash
# Lancer toute la stack
docker-compose up -d

# Services démarrés:
# - frontend:3000
# - backend:5009 (internal 5001)
# - api-gateway:5001
# - mongo:27017
# - kafka:9092
# - zookeeper:2181
# - prometheus:9090
# - grafana:3001
# - kafka-ui:8080
# - 6 microservices (ports 3001-3006)

# Vérifier les logs
docker-compose logs -f backend

# Arrêter
docker-compose down
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/integration.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd backend && npm ci
      - run: cd backend && npm run lint
      - run: cd backend && npm test

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
      - run: cd frontend && npm run type-check

  build:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    steps:
      - run: docker-compose build
      - run: docker push [registry]/reclamtrack
```

### Variables d'Environnement Requises

#### Backend (.env)

```bash
# Server
PORT=5001
NODE_ENV=production

# Database
MONGO_URI=mongodb://localhost:27017/reclamtrack

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Kafka
KAFKA_BROKER=localhost:9092
DISABLE_KAFKA=false

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
```

#### Frontend (.env.local)

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Scripts de Déploiement

```bash
# Depuis la racine du projet

# Installation des dépendances
npm run install:all

# Développement local
npm run dev              # Frontend + Backend
npm run dev:frontend     # Frontend uniquement
npm run dev:backend      # Backend uniquement

# Build production
npm run build            # Build Frontend + Backend
npm run build:all        # Build tous les projets

# Démarrage production
npm run start           # Lance les serveurs en mode production

# Docker
docker-compose up -d    # Lance tous les services
docker-compose down     # Arrête tous les services
```

---

## 📚 Documentation Complémentaire

### Fichiers de Documentation

Le projet contient une documentation extensive dans la racine:

| Fichier                   | Description                   |
| ------------------------- | ----------------------------- |
| `README.md`               | Introduction générale         |
| `QUICKSTART.md`           | Guide de démarrage rapide     |
| `DEPLOYMENT.md`           | Guide de déploiement détaillé |
| `CONTRIBUTING.md`         | Guide de contribution         |
| `ARCHITECTURE.md`         | Architecture (vue d'ensemble) |
| `PAGES_INDEX.md`          | Index de toutes les pages     |
| `ROUTES_MAPPING.md`       | Mapping des routes            |
| `GOOGLE_OAUTH.md`         | Configuration OAuth Google    |
| `GRAFANA_GUIDE.md`        | Guide Grafana                 |
| `HARMONISATION_ROUTES.md` | Harmonisation des routes      |

### Ressources Externes

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Socket.IO Docs](https://socket.io/docs/)

---

## 🎓 Glossaire

| Terme            | Définition                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| **Réclamation**  | Demande ou plainte d'un citoyen nécessitant une intervention                                        |
| **Organisation** | Entité (municipalité, entreprise) utilisant la plateforme                                           |
| **Multi-tenant** | Architecture où plusieurs organisations partagent la même infrastructure avec isolation des données |
| **Saga**         | Pattern de gestion de transactions distribuées dans les microservices                               |
| **RBAC**         | Role-Based Access Control - Contrôle d'accès basé sur les rôles                                     |
| **JWT**          | JSON Web Token - Standard d'authentification                                                        |
| **WebSocket**    | Protocole de communication bidirectionnelle en temps réel                                           |
| **Kafka**        | Plateforme de streaming d'événements distribuée                                                     |

---

## 📞 Support & Contact

Pour toute question sur l'architecture:

- **Documentation**: Voir fichiers `*.md` à la racine
- **Issues**: GitHub Issues
- **Email**: support@reclamtrack.com

---

**Dernière révision**: 2026-02-17  
**Version du document**: 1.0  
**Prochaine révision prévue**: TBD
