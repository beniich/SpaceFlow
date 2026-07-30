# 📖 ReclamTrack - Guide de Référence Rapide

> **Guide condensé pour les développeurs**  
> Voir `ARCHITECTURE_COMPLETE.md` pour la documentation complète

---

## 🚀 Démarrage Rapide

```bash
# 1. Installation
git clone [repo-url]
cd reclamtrack
npm run install:all

# 2. Configuration
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Éditer les fichiers .env avec vos configurations

# 3. Lancement
npm run dev              # Frontend + Backend
# OU
docker-compose up -d     # Stack complète avec microservices
```

**URLs Locales:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Grafana: http://localhost:3001 (admin/reclamtrack2024)
- Kafka UI: http://localhost:8080
- Prometheus: http://localhost:9090

---

## 📂 Structure Projet

```
reclamtrack/
├── backend/          # Express.js API (Port 5009)
├── frontend/         # Next.js 15 (Port 3000)
├── shared/           # Types partagés TypeScript
├── microservices/    # 6 microservices Kafka
├── monitoring/       # Prometheus + Grafana config
└── docker-compose.yml
```

---

## 🛠️ Stack Technologique

| Couche         | Technologies                                  |
| -------------- | --------------------------------------------- |
| **Frontend**   | Next.js 15, React 19, TypeScript, TailwindCSS |
| **State**      | Zustand, React Query, Socket.IO Client        |
| **Backend**    | Express.js, TypeScript, MongoDB (Mongoose)    |
| **Auth**       | JWT, bcryptjs, Google OAuth                   |
| **Real-time**  | Socket.IO                                     |
| **Messaging**  | Apache Kafka + Zookeeper                      |
| **Monitoring** | Prometheus, Grafana, Winston                  |
| **Security**   | Helmet, CORS, Rate Limit, XSS Clean           |

---

## 🗄️ Collections MongoDB (18)

```javascript
// Principales collections
users; // Utilisateurs
organizations; // Organisations/Municipalités
memberships; // Liaison user-org
complaints; // Réclamations citoyennes
teams; // Équipes d'intervention
assignments; // Attributions équipe-réclamation
interventions; // Interventions terrain
audit_logs; // Logs d'audit

// Collections supplémentaires
(planning_slots,
  schedulers,
  rosters,
  leaves,
  vehicles,
  requisitions,
  messages,
  knowledge,
  feedback,
  staff);
```

---

## 🔌 API Routes Principales (26 routes)

### Authentification

```typescript
POST / api / auth / login; // Connexion
POST / api / auth / register; // Inscription
POST / api / auth / google; // OAuth Google
```

### Organisations & Membres

```typescript
GET    /api/organizations       // Liste organisations
POST   /api/organizations       // Créer organisation
GET    /api/organizations/:id/members    // Membres
POST   /api/memberships         // Ajouter membre
```

### Réclamations

```typescript
GET    /api/complaints          // Liste (filtrée par org)
POST   /api/complaints          // Créer réclamation
GET    /api/complaints/:id      // Détails
PUT    /api/complaints/:id      // Mettre à jour
DELETE /api/complaints/:id      // Supprimer
```

### Équipes

```typescript
GET / api / teams; // Liste équipes
POST / api / teams; // Créer équipe
POST / api / assignments; // Assigner équipe à réclamation
```

### Dashboard & Analytics

```typescript
GET    /api/dashboard           // Stats dashboard
GET    /api/analytics/*         // Analytique avancée
```

### Autres

```typescript
POST / api / upload; // Upload fichiers
GET / api / audit - logs; // Logs d'audit
POST / api / feedback; // Retours utilisateurs
```

---

## 🔐 Authentification

### Flow JWT

```typescript
// 1. Login
POST /api/auth/login
Body: { email: "user@example.com", password: "xxx" }
Response: { token: "eyJhbG...", user: {...}, organization: {...} }

// 2. Requêtes protégées
GET /api/complaints
Headers: { Authorization: "Bearer eyJhbG..." }
```

### Middleware Pipeline

```
Request
  ↓
[auth.ts]        → Vérifie JWT, injecte req.user
  ↓
[orgContext.ts]  → Injecte req.organizationId
  ↓
[validator.ts]   → Valide inputs
  ↓
Route Handler
```

### Rôles RBAC

- `citizen` - Créer réclamations
- `agent` - Gérer réclamations assignées
- `manager` - Assigner, superviser
- `admin` - Administration organisation
- `superadmin` - Administration plateforme

---

## 🎨 Frontend - Routes

### Pages Publiques

```
/                    # Landing page
/pricing             # Tarification
/services            # Services
/checkout            # Paiement
```

### Authentification

```
/login               # Connexion
/register            # Inscription
```

### Application (protégées)

```
/dashboard           # Dashboard principal
/map                 # Carte interactive
/analytics           # Analytique
/teams               # Gestion équipes
/planning            # Planification
/messages            # Messagerie
/settings            # Paramètres
```

### Admin

```
/admin/monitoring    # Grafana dashboard
/admin/devops        # 11 dashboards DevOps
/admin-db            # Admin base de données
/audit-logs          # Logs d'audit
```

---

## 🏗️ Architecture Microservices

### Services (Ports 3001-3006)

```
auth-service:3001         → Authentication
complaints-service:3002   → CRUD réclamations
teams-service:3003        → Gestion équipes
notification-service:3004 → Email/SMS/Push
analytics-service:3005    → Reporting
inventory-service:3006    → Gestion stock
```

### Topics Kafka

```
complaint.created       → Nouvelle réclamation
complaint.assigned      → Équipe assignée
complaint.updated       → Statut màj
team.notified           → Notification équipe
notification.sent       → Notification envoyée
analytics.generated     → Rapport généré
```

---

## 🔄 Flux de Données - Exemple

**Création de réclamation:**

```
1. Frontend → POST /api/complaints
2. Backend → Valide & Insert MongoDB
3. Backend → Publish "complaint.created" (Kafka)
4. Complaints Service → Auto-assign team
5. Complaints Service → Publish "complaint.assigned"
6. Teams Service → Notify team
7. Notification Service → Send email/SMS
8. Backend Saga → Update complaint status
9. Socket.IO → Broadcast to connected clients
10. Frontend → Real-time UI update
```

---

## 📊 State Management (Frontend)

### Zustand Stores

```typescript
authStore; // user, token, isAuthenticated
organizationStore; // organization, members
complaintStore; // complaints, filters
notificationStore; // notifications, unread count
uiStore; // modals, sidebar, theme
```

### React Query

```typescript
// Server state caching
useQuery(["complaints", filters], fetchComplaints);
useQuery(["teams"], fetchTeams);
useMutation(createComplaint, {
  onSuccess: () => queryClient.invalidateQueries(["complaints"]),
});
```

---

## 🔌 WebSocket (Real-time)

### Backend (Socket.IO Server)

```typescript
// services/socketService.ts
notificationService.broadcast({
  type: "complaint_updated",
  data: { complaintId, status },
  targetOrg: organizationId,
});
```

### Frontend (Socket.IO Client)

```typescript
// lib/socket.ts
socket.on("complaint_updated", (data) => {
  complaintStore.updateComplaint(data);
  toast.success("Réclamation mise à jour!");
});
```

---

## 🛡️ Sécurité

### Backend

```typescript
// Helmet - Security headers
app.use(helmet());

// CORS
app.use(cors({ origin: process.env.ALLOWED_ORIGINS }));

// Rate limiting
app.use("/api/", rateLimiter); // 100 req/15min

// XSS protection
app.use(xssClean());

// Input validation
app.use([
  body("title").trim().isLength({ min: 5, max: 200 }),
  body("email").isEmail(),
]);
```

### Frontend

```typescript
// Zod validation
const schema = z.object({
  title: z.string().min(5).max(200),
  email: z.string().email(),
});

// React Hook Form
const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

---

## 📈 Monitoring

### Prometheus Metrics

```
http://localhost:9090

# Metrics exposées:
- http_requests_total
- http_request_duration_seconds
- mongodb_connections
- kafka_consumer_lag
```

### Grafana Dashboards

```
http://localhost:3001
Login: admin / reclamtrack2024

Dashboards:
- System Overview (CPU, RAM, Disk)
- API Performance (Latency, Errors)
- Kafka Metrics (Topics, Lag)
- Database Metrics (Queries, Connections)
```

### Winston Logs

```typescript
// backend/src/utils/logger.ts
logger.info("User logged in", { userId, orgId });
logger.error("DB connection failed", { error });

// Fichiers logs:
-backend / info.log - backend / error.log;
```

---

## 🧪 Testing

### Backend

```bash
cd backend
npm test              # Unit tests
npm run test:watch    # Watch mode
```

### Frontend

```bash
cd frontend
npm run test          # Playwright E2E
npm run lint          # ESLint
npm run type-check    # TypeScript
```

---

## 🚀 Déploiement

### Build Production

```bash
npm run build         # Build frontend + backend
npm run build:all     # Inclut microservices
```

### Docker

```bash
docker-compose build
docker-compose up -d
docker-compose logs -f backend
docker-compose down
```

### Variables d'Environnement Critiques

**Backend (.env):**

```bash
PORT=5001
MONGO_URI=mongodb://localhost:27017/reclamtrack
JWT_SECRET=your-secret-key
KAFKA_BROKER=localhost:9092
GOOGLE_CLIENT_ID=xxx
STRIPE_SECRET_KEY=sk_xxx
```

**Frontend (.env.local):**

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx
NEXTAUTH_SECRET=xxx
```

---

## 🐛 Debug

### Vérifier santé des services

```bash
# Backend
curl http://localhost:5001/

# Frontend
curl http://localhost:3000/

# Kafka
docker-compose logs kafka

# MongoDB
docker exec -it mongo mongosh
> use reclamtrack
> db.complaints.find().limit(5)
```

### Logs en temps réel

```bash
# Backend
docker-compose logs -f backend

# Frontend
docker-compose logs -f frontend

# Tous les services
docker-compose logs -f
```

---

## 📚 Commandes Utiles

```bash
# Installation
npm run install:all

# Développement
npm run dev                # Frontend + Backend
npm run dev:frontend       # Frontend seulement
npm run dev:backend        # Backend seulement

# Build
npm run build
npm run build:all

# Production
npm run start

# Docker
docker-compose up -d
docker-compose down
docker-compose restart backend
docker-compose ps

# MongoDB
npm run seed              # Seed database (backend)
```

---

## 🔗 Liens Utiles

### Documentation

- `ARCHITECTURE_COMPLETE.md` - Documentation complète
- `ARCHITECTURE_DIAGRAMS.md` - Diagrammes visuels
- `QUICKSTART.md` - Guide démarrage
- `DEPLOYMENT.md` - Guide déploiement
- `GOOGLE_OAUTH.md` - Configuration OAuth

### Ressources Externes

- [Next.js Docs](https://nextjs.org/docs)
- [Express Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Kafka Docs](https://kafka.apache.org/documentation/)
- [Socket.IO Docs](https://socket.io/docs/)

---

## ⚡ Raccourcis Clavier (Frontend)

```
Ctrl+K        → Recherche globale (à implémenter)
Ctrl+B        → Toggle sidebar
Ctrl+Shift+N  → Nouvelle réclamation
```

---

## 🎯 Checklist Développeur

### Avant de committer

- [ ] `npm run lint` passe sans erreurs
- [ ] `npm run type-check` passe
- [ ] Tests pertinents écrits/mis à jour
- [ ] Documentation mise à jour si nécessaire
- [ ] Pas de `console.log` laissés dans le code
- [ ] Variables sensibles dans `.env`, pas en dur

### Avant de déployer

- [ ] Build production réussi
- [ ] Tests E2E passent
- [ ] Variables env configurées sur le serveur
- [ ] Backups DB récents
- [ ] Monitoring configuré
- [ ] Plan de rollback préparé

---

## 🆘 Dépannage Rapide

### Backend ne démarre pas

```bash
# Vérifier MongoDB
docker-compose ps mongo
docker-compose logs mongo

# Vérifier .env
cat backend/.env | grep MONGO_URI

# Vérifier port
netstat -ano | findstr :5001
```

### Frontend ne build pas

```bash
# Clear cache
rm -rf frontend/.next
rm -rf frontend/node_modules
npm install

# Vérifier types
npm run type-check
```

### Kafka ne fonctionne pas

```bash
# Restart Kafka stack
docker-compose restart zookeeper kafka

# Vérifier topics
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092
```

---

**Dernière mise à jour:** 2026-02-17  
**Version:** 1.0
