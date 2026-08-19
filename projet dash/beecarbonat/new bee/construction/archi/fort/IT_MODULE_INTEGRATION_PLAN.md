# 🎯 ReclamTrack 3.0 - Plan d'Intégration Module IT

> **Feuille de route pour l'intégration complète de l'administration IT et Active Directory**  
> Date: 2026-02-17

---

## 📋 Vue d'Ensemble

ReclamTrack évolue d'une **plateforme de gestion de réclamations citoyennes** vers une **solution complète de gestion municipale** incluant:

### Module Existant ✅

- Gestion réclamations citoyennes
- Équipes d'intervention
- Analytique et reporting
- Carte interactive
- Multi-tenant

### Nouveau Module IT 🆕

- **Administration Active Directory**
- **Gestion Assets IT**
- **Monitoring Réseau**
- **Helpdesk IT**

---

## 🗂️ Documentation Créée

### 1. IT_ADMINISTRATION_ARCHITECTURE.md

**Contenu:**

- Vue d'ensemble complète
- Architecture technique détaillée
- Intégration Active Directory (LDAP)
- Modèles de données
- Services de monitoring
- Cas d'usage

**Pour qui:** Architectes, Lead Developers

### 2. IT_ADMINISTRATION_IMPLEMENTATION.md

**Contenu:**

- Routes API complètes
- Composants frontend
- Configuration & installation
- Sécurité & permissions
- Métriques Prometheus
- Roadmap d'implémentation

**Pour qui:** Développeurs

---

## 🏗️ Architecture Proposée

```
┌────────────────────────────────────────────────────────────┐
│                  RECLAMTRACK 3.0 - COMPLET                  │
└────────────────────────────────────────────────────────────┘

┌─────────────────────────┐    ┌─────────────────────────┐
│   MODULE CITOYENS       │    │   MODULE IT ADMIN       │
│   (Existant)            │    │   (Nouveau)             │
├─────────────────────────┤    ├─────────────────────────┤
│ • Réclamations          │    │ • Active Directory      │
│ • Équipes               │    │ • Assets IT             │
│ • Interventions         │    │ • Monitoring Réseau     │
│ • Carte                 │    │ • Tickets IT            │
│ • Analytics             │    │ • Inventaire            │
└─────────────────────────┘    └─────────────────────────┘
         │                              │
         └──────────────┬───────────────┘
                        │
                        ▼
    ┌──────────────────────────────────────────┐
    │        BACKEND UNIFIÉ (Express.js)        │
    ├──────────────────────────────────────────┤
    │  • 26 routes existantes                  │
    │  • 4 nouvelles routes IT:                │
    │    - /api/ad                             │
    │    - /api/it-assets                      │
    │    - /api/network                        │
    │    - /api/it-tickets                     │
    └──────────────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
    ┌────────┐   ┌──────────┐   ┌──────────┐
    │MongoDB │   │   Active │   │  SNMP    │
    │        │   │ Directory│   │ Devices  │
    │22 coll.│   │   LDAP   │   │          │
    └────────┘   └──────────┘   └──────────┘
```

---

## 🗄️ Nouvelles Collections MongoDB

### Collections IT (4 nouvelles)

```javascript
// 1. it_assets - Inventaire matériel IT
{
  _id: ObjectId,
  organizationId: ObjectId,
  assetTag: "IT-2026-001",
  name: "Server-Web-01",
  type: "server", // server, workstation, laptop, network_device, printer, etc.
  status: "active", // active, inactive, maintenance, retired
  manufacturer: "Dell",
  model: "PowerEdge R740",
  serialNumber: "ABC123XYZ",
  hostname: "web-srv-01",
  ipAddress: "192.168.1.100",
  assignedTo: ObjectId,
  location: { building, floor, room, rack },
  purchaseDate: Date,
  warrantyExpiration: Date,
  software: [{ name, version, licenseKey }],
  monitoringEnabled: true,
  lastSeenOnline: Date
}

// 2. network_devices - Équipements réseau
{
  _id: ObjectId,
  organizationId: ObjectId,
  name: "Switch-Core-01",
  type: "switch", // router, switch, firewall, access_point
  ipAddress: "192.168.1.1",
  snmpCommunity: "encrypted",
  interfaces: [
    {
      name: "GigabitEthernet0/1",
      status: "up",
      speed: 1000,
      vlan: 10,
      inOctets: 123456789,
      outOctets: 987654321
    }
  ],
  currentMetrics: {
    cpuUsage: 45,
    memoryUsage: 60,
    uptime: 8640000,
    isOnline: true
  }
}

// 3. it_tickets - Tickets support IT
{
  _id: ObjectId,
  organizationId: ObjectId,
  ticketNumber: "IT-2026-0042",
  title: "Imprimante ne fonctionne pas",
  description: "...",
  category: "printing", // hardware, software, network, account, etc.
  priority: "moyenne", // basse, moyenne, haute, urgente, critique
  status: "nouveau", // nouveau, assigné, en_cours, résolu, fermé
  requestedBy: ObjectId,
  assignedTo: ObjectId,
  relatedAsset: ObjectId,
  sla: {
    responseTime: 480, // minutes
    resolutionTime: 4320,
    responseDeadline: Date,
    resolutionDeadline: Date,
    breached: false
  },
  updates: [
    { timestamp: Date, userId: ObjectId, message: "...", internal: false }
  ],
  resolution: {
    summary: "...",
    rootCause: "...",
    solution: "..."
  },
  createdAt: Date,
  resolvedAt: Date
}

// 4. ad_sync_logs - Logs synchronisation AD
{
  _id: ObjectId,
  organizationId: ObjectId,
  username: "john.doe",
  action: "imported", // imported, updated, disabled
  timestamp: Date,
  details: Mixed
}
```

**Total Collections:** 18 existantes + 4 nouvelles = **22 collections**

---

## 🔌 Nouvelles Routes API

### 1. /api/ad - Active Directory

```typescript
GET    /api/ad/users               // Liste utilisateurs AD
GET    /api/ad/users/:username     // Détails utilisateur
POST   /api/ad/users               // Créer utilisateur AD
PUT    /api/ad/users/:username     // Modifier utilisateur
DELETE /api/ad/users/:username     // Désactiver utilisateur
POST   /api/ad/users/:username/reset-password   // Reset password
POST   /api/ad/sync                // Sync AD → MongoDB
GET    /api/ad/groups              // Liste groupes AD
POST   /api/ad/groups/:group/members   // Ajouter membre à un groupe
```

### 2. /api/it-assets - Gestion Assets

```typescript
GET    /api/it-assets              // Liste assets
POST   /api/it-assets              // Créer asset
GET    /api/it-assets/:id          // Détails asset
PUT    /api/it-assets/:id          // Modifier asset
DELETE /api/it-assets/:id          // Supprimer asset
POST   /api/it-assets/discover     // Auto-discovery réseau
POST   /api/it-assets/import-ad    // Import depuis AD
GET    /api/it-assets/stats        // Statistiques assets
```

### 3. /api/network - Monitoring Réseau

```typescript
GET    /api/network/devices            // Liste devices réseau
POST   /api/network/devices            // Ajouter device
GET    /api/network/devices/:id        // Détails device
PUT    /api/network/devices/:id        // Modifier device
GET    /api/network/devices/:id/metrics  // Métriques temps réel
POST   /api/network/monitor            // Lancer monitoring
GET    /api/network/alerts             // Alertes réseau
GET    /api/network/topology           // Topologie réseau
```

### 4. /api/it-tickets - Helpdesk IT

```typescript
GET    /api/it-tickets             // Liste tickets
POST   /api/it-tickets             // Créer ticket
GET    /api/it-tickets/:id         // Détails ticket
PUT    /api/it-tickets/:id         // Modifier ticket
POST   /api/it-tickets/:id/updates // Ajouter commentaire
POST   /api/it-tickets/:id/assign  // Assigner ticket
GET    /api/it-tickets/stats       // Statistiques tickets
```

**Total Routes API:** 26 existantes + ~30 nouvelles = **~56 routes**

---

## 🎨 Nouvelles Pages Frontend

```
frontend/src/app/[locale]/(app)/it-admin/
│
├── page.tsx                          # Dashboard IT principal
│
├── active-directory/
│   ├── page.tsx                      # Vue d'ensemble AD
│   ├── users/
│   │   ├── page.tsx                  # Liste utilisateurs
│   │   └── [username]/page.tsx       # Détails utilisateur
│   ├── groups/page.tsx               # Gestion groupes
│   └── sync/page.tsx                 # Synchronisation
│
├── assets/
│   ├── page.tsx                      # Liste assets
│   ├── [id]/page.tsx                 # Détails asset
│   ├── new/page.tsx                  # Ajouter asset
│   ├── discover/page.tsx             # Auto-discovery
│   └── import/page.tsx               # Import depuis AD
│
├── network/
│   ├── page.tsx                      # Dashboard réseau
│   ├── devices/
│   │   ├── page.tsx                  # Liste devices
│   │   └── [id]/page.tsx             # Détails device
│   ├── topology/page.tsx             # Topologie visuelle
│   ├── monitoring/page.tsx           # Monitoring temps réel
│   └── alerts/page.tsx               # Alertes & incidents
│
└── tickets/
    ├── page.tsx                      # Liste tickets
    ├── [id]/page.tsx                 # Détails ticket
    ├── new/page.tsx                  # Créer ticket
    └── stats/page.tsx                # Statistiques & SLA
```

**Total Pages:** 30+ existantes + 20 nouvelles = **~50 pages**

---

## 🛠️ Nouveaux Microservices

```
microservices/
│
├── ad-service/                    # Port 3007
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── ldap-client.ts        # LDAP logic
│   │   ├── sync-handler.ts       # Sync AD → MongoDB
│   │   └── kafka-consumer.ts     # Consumer Kafka
│   └── package.json
│
├── monitoring-service/            # Port 3008
│   ├── src/
│   │   ├── index.ts
│   │   ├── snmp-poller.ts        # SNMP polling
│   │   ├── ping-monitor.ts        # Ping monitoring
│   │   ├── alert-manager.ts      # Gestion alertes
│   │   └── kafka-producer.ts     # Producer Kafka
│   └── package.json
│
├── asset-service/                 # Port 3009
│   ├── src/
│   │   ├── index.ts
│   │   ├── discovery.ts          # Network discovery
│   │   ├── lifecycle.ts          # Asset lifecycle
│   │   └── inventory.ts          # Inventory management
│   └── package.json
│
└── helpdesk-service/              # Port 3010
    ├── src/
    │   ├── index.ts
    │   ├── ticket-router.ts      # Auto-routing tickets
    │   ├── sla-monitor.ts        # SLA tracking
    │   └── knowledge-base.ts     # Knowledge base
    └── package.json
```

**Total Microservices:** 6 existants + 4 nouveaux = **10 microservices**

---

## 📦 Dépendances NPM à Ajouter

### Backend

```bash
cd backend

# Active Directory
npm install ldapjs                  # Client LDAP
npm install activedirectory2        # Helper AD
npm install @types/ldapjs -D

# Network Monitoring
npm install net-snmp                # SNMP protocol
npm install ping                    # Ping utility
npm install nmap                    # Network scanner
npm install snmp-native             # Alternative SNMP

# Encryption
npm install node-forge              # Crypto utilities

# Scheduling
npm install node-cron               # Cron jobs
npm install @types/node-cron -D
```

### Frontend

```bash
cd frontend

# Visualisation
npm install recharts                # Charts
npm install react-flow-renderer     # Network topology
npm install vis-network             # Network visualization
npm install @tanstack/react-table   # Advanced tables
```

---

## ⚙️ Configuration Requise

### 1. Variables d'Environnement

```bash
# backend/.env

# ========== ACTIVE DIRECTORY ==========
AD_ENABLED=true
AD_URL=ldaps://dc.example.com:636
AD_BASE_DN=DC=example,DC=com
AD_USERNAME=admin@example.com
AD_PASSWORD=your_secure_password
AD_SYNC_INTERVAL=3600000           # 1 heure en ms

# ========== NETWORK MONITORING ==========
SNMP_ENABLED=true
SNMP_DEFAULT_COMMUNITY=public
SNMP_DEFAULT_VERSION=2c
SNMP_TIMEOUT=5000
MONITORING_INTERVAL=60000          # 1 minute

# ========== SECURITY ==========
ENCRYPTION_KEY=your_32_byte_encryption_key
AD_CREDENTIALS_ENCRYPTED=true

# ========== MICROSERVICES PORTS ==========
AD_SERVICE_PORT=3007
MONITORING_SERVICE_PORT=3008
ASSET_SERVICE_PORT=3009
HELPDESK_SERVICE_PORT=3010
```

### 2. Docker Compose - Ajouts

```yaml
# docker-compose.yml (additions)

services:
  # ... services existants ...

  # Nouveau: AD Service
  ad-service:
    build: ./microservices/ad-service
    ports:
      - "3007:3007"
    environment:
      - KAFKA_BROKER=${KAFKA_BROKER}
      - MONGO_URI=${MONGO_URI}
      - AD_URL=${AD_URL}
      - AD_USERNAME=${AD_USERNAME}
      - AD_PASSWORD=${AD_PASSWORD}
    depends_on:
      - kafka
      - mongodb
    networks:
      - reclamtrack-network

  # Nouveau: Monitoring Service
  monitoring-service:
    build: ./microservices/monitoring-service
    ports:
      - "3008:3008"
    environment:
      - KAFKA_BROKER=${KAFKA_BROKER}
      - MONGO_URI=${MONGO_URI}
    depends_on:
      - kafka
      - mongodb
    networks:
      - reclamtrack-network
    # Accès réseau privilégié pour SNMP/Ping
    cap_add:
      - NET_RAW
      - NET_ADMIN

  # Nouveau: Asset Service
  asset-service:
    build: ./microservices/asset-service
    ports:
      - "3009:3009"
    environment:
      - KAFKA_BROKER=${KAFKA_BROKER}
      - MONGO_URI=${MONGO_URI}
    depends_on:
      - kafka
      - mongodb
    networks:
      - reclamtrack-network

  # Nouveau: Helpdesk Service
  helpdesk-service:
    build: ./microservices/helpdesk-service
    ports:
      - "3010:3010"
    environment:
      - KAFKA_BROKER=${KAFKA_BROKER}
      - MONGO_URI=${MONGO_URI}
    depends_on:
      - kafka
      - mongodb
    networks:
      - reclamtrack-network
```

---

## 🗺️ Topics Kafka Supplémentaires

```yaml
# Nouveaux topics pour module IT

# Active Directory
- ad.user.synced # Utilisateur synchronisé
- ad.user.created # Utilisateur créé dans AD
- ad.user.disabled # Utilisateur désactivé

# Assets
- asset.created # Asset créé
- asset.updated # Asset mis à jour
- asset.discovered # Asset découvert automatiquement

# Network Monitoring
- network.device.offline # Device hors ligne
- network.alert.created # Alerte réseau créée
- network.metric.high # Métrique au-dessus du seuil

# Helpdesk
- ticket.created # Ticket IT créé
- ticket.assigned # Ticket assigné
- ticket.resolved # Ticket résolu
- ticket.sla.breach # SLA dépassé
```

**Total Topics:** ~15 existants + ~12 nouveaux = **~27 topics**

---

## 🎯 Plan d'Implémentation (10 Semaines)

### 📅 Phase 1: Foundation (Semaines 1-2)

**Objectif:** Infrastructure de base

- [ ] **Semaine 1**
  - [x] Créer documentation architecture (FAIT)
  - [ ] Créer modèles MongoDB (ITAsset, NetworkDevice, ITTicket, ADSyncLog)
  - [ ] Setup 4 nouveaux microservices (squelettes)
  - [ ] Configurer nouveaux topics Kafka
- [ ] **Semaine 2**
  - [ ] Créer routes API de base (CRUD)
  - [ ] Tests Postman/Insomnia
  - [ ] Setup page dashboard IT (frontend)
  - [ ] Configuration environnement (.env)

**Livrable:** API de base fonctionnelle

---

### 📅 Phase 2: Active Directory (Semaines 3-4)

**Objectif:** Intégration AD complète

- [ ] **Semaine 3**
  - [ ] Implémenter ActiveDirectoryService
  - [ ] Connexion LDAP/LDAPS
  - [ ] Fonctions de base (auth, query users)
  - [ ] Tests connexion AD

- [ ] **Semaine 4**
  - [ ] Sync bidirectionnelle AD ↔ MongoDB
  - [ ] Cron job synchronisation automatique
  - [ ] Interface gestion utilisateurs AD (frontend)
  - [ ] Tests complets authentification AD

**Livrable:** Module AD 100% fonctionnel

---

### 📅 Phase 3: Assets IT & Discovery (Semaines 5-6)

**Objectif:** Gestion inventaire IT

- [ ] **Semaine 5**
  - [ ] Service de découverte réseau (NMAP)
  - [ ] Import assets depuis AD
  - [ ] Interface liste/détails assets
  - [ ] CRUD assets complet

- [ ] **Semaine 6**
  - [ ] Tracking lifecycle assets
  - [ ] Gestion licences logicielles
  - [ ] Rapports d'inventaire
  - [ ] Export Excel/CSV

**Livrable:** Module Assets opérationnel

---

### 📅 Phase 4: Monitoring Réseau (Semaines 7-8)

**Objectif:** Supervision réseau temps réel

- [ ] **Semaine 7**
  - [ ] Intégration SNMP
  - [ ] Ping monitoring
  - [ ] Collecte métriques (CPU, RAM, interfaces)
  - [ ] Stockage métriques (MongoDB + Prometheus)

- [ ] **Semaine 8**
  - [ ] Système d'alertes
  - [ ] Dashboard monitoring temps réel
  - [ ] Topologie réseau visuelle
  - [ ] Dashboards Grafana personnalisés

**Livrable:** Monitoring réseau actif

---

### 📅 Phase 5: Helpdesk IT (Semaines 9-10)

**Objectif:** Support IT interne

- [ ] **Semaine 9**
  - [ ] Système tickets IT
  - [ ] Calcul SLA automatique
  - [ ] Interface création/gestion tickets
  - [ ] Notifications temps réel

- [ ] **Semaine 10**
  - [ ] Auto-assignment intelligent
  - [ ] Knowledge base
  - [ ] Rapports SLA
  - [ ] Enquêtes satisfaction

**Livrable:** Module Helpdesk complet

---

### 📅 Phase 6: Tests & Production (Semaine 11-12)

**Objectif:** Stabilisation et déploiement

- [ ] **Semaine 11**
  - [ ] Tests d'intégration complets
  - [ ] Tests de charge
  - [ ] Corrections bugs
  - [ ] Documentation utilisateur

- [ ] **Semaine 12**
  - [ ] Migration données existantes
  - [ ] Déploiement production
  - [ ] Formation utilisateurs
  - [ ] Monitoring post-déploiement

**Livrable:** ReclamTrack 3.0 en production

---

## ✅ Checklist de Démarrage

### Avant de Commencer

- [ ] Accès à un serveur Active Directory de test
- [ ] Credentials admin AD (pour tests)
- [ ] Infrastructure réseau de test (switches/routers)
- [ ] SNMP activé sur devices de test
- [ ] Budget pour licences (si nécessaire)

### Setup Développement

- [ ] Installer NMAP sur machine de dev
- [ ] Installer SNMP tools (`snmpwalk`, `snmpget`)
- [ ] Configurer AD de test/dev
- [ ] Augmenter ressources Docker (RAM/CPU)

### Documentation

- [x] Architecture complète rédigée
- [x] Guide d'implémentation créé
- [ ] Diagrammes techniques validés
- [ ] Plan projet approuvé

---

## 🔗 Liens Vers Documentation

1. **IT_ADMINISTRATION_ARCHITECTURE.md** - Architecture complète
2. **IT_ADMINISTRATION_IMPLEMENTATION.md** - Guide d'implémentation
3. **ARCHITECTURE_COMPLETE.md** - Architecture existante ReclamTrack
4. **ARCHITECTURE_DIAGRAMS.md** - Diagrammes visuels
5. **QUICKSTART.md** - Démarrage rapide

---

## 📊 Métriques de Succès

### KPIs Module IT

- **Active Directory**
  - Taux de synchronisation: > 99%
  - Utilisateurs synchronisés: 100%
  - Temps de sync: < 5min

- **Assets IT**
  - Assets inventoriés: > 90% du parc
  - Précision données: > 95%
  - Auto-discovery: > 80% détection

- **Monitoring Réseau**
  - Disponibilité monitoring: > 99.5%
  - Alertes faux-positifs: < 5%
  - Temps détection incident: < 2min

- **Helpdesk IT**
  - Taux respect SLA: > 90%
  - Temps résolution moyen: < objectif SLA
  - Satisfaction utilisateurs: > 4/5

---

## 🎓 Formation Requise

### Équipe Backend

- [ ] Protocole LDAP/Active Directory
- [ ] SNMP et monitoring réseau
- [ ] Kafka pour événements IT

### Équipe Frontend

- [ ] Visualisation de données (charts)
- [ ] Topologie réseau (diagrammes)
- [ ] Real-time updates (Socket.IO)

### Équipe DevOps

- [ ] Configuration AD en environnement conteneurisé
- [ ] Sécurisation credentials AD
- [ ] Scaling microservices supplémentaires

---

**Date de création:** 2026-02-17  
**Version du document:** 1.0  
**Statut:** ✅ Prêt pour démarrage  
**Prochaine revue:** Fin Phase 1 (2 semaines)
