# 🔗 ReclamTrack - Intégration Module IT & Réclamations Citoyennes

> **Comment les deux modules coexistent et se renforcent mutuellement**  
> Date: 2026-02-17

---

## 🎯 Vue d'Ensemble

ReclamTrack 3.0 combine maintenant **2 modules complémentaires** :

### 1. Module Citoyens (EXISTANT) ✅

- **Réclamations citoyennes** : Voirie, Éclairage, Déchets, etc.
- **Workflow** : nouveau → en_cours → en_attente → résolu
- **Modèle** : `Reclamation` avec commentaires et historique
- **Interface** : UI moderne avec timeline et badges

### 2. Module IT Admin (NOUVEAU) 🆕

- **Administration Active Directory**
- **Gestion Assets IT**
- **Monitoring Réseau**
- **Tickets IT** : Support technique interne

---

## 🔄 Synergies Entre Les Modules

```
┌─────────────────────────────────────────────────────────────┐
│                    RECLAMTRACK 3.0 UNIFIÉ                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MODULE CITOYENS              │    MODULE IT ADMIN          │
│  (Public-facing)              │    (Internal)               │
│  ─────────────────            │    ──────────────           │
│                               │                             │
│  👥 Citoyens signalent        │    🔧 IT gère infrastructure│
│     problèmes infrastructure  │       qui supporte la        │
│                               │       plateforme             │
│  📍 Réclamations terrain      │    💻 Tickets techniques    │
│     (nids de poule, etc.)     │       (serveurs, réseau)    │
│                               │                             │
│  📊 Dashboard Agents          │    📊 Dashboard Admins      │
│     municipaux                │       système               │
│                               │                             │
└─────────────────────────────────────────────────────────────┘
         │                                   │
         └───────────────┬───────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  BACKEND UNIFIÉ      │
              │  • Utilisateurs AD   │
              │  • Auth centralisée  │
              │  • Notifications     │
              │  • Analytics         │
              └──────────────────────┘
```

---

## 📊 Comparaison des Modèles

### Réclamation Citoyenne (EXISTANT)

```typescript
interface IReclamation {
  id_reclamation: string;           // "REC-0042"
  titre: string;
  description: string;
  categorie: "Voirie" | "Éclairage" | ...;
  priorite: "critique" | "haute" | "moyenne" | "faible";
  statut: "nouveau" | "en_cours" | "en_attente" | "resolu";

  // Citoyen
  citoyen: string;
  email_citoyen?: string;
  telephone_citoyen?: string;
  localisation?: string;

  // Workflow
  commentaires: ICommentaire[];
  assigne_a?: string;
  date_resolution?: Date;
  historique_statuts: {...}[];
}
```

### Ticket IT (NOUVEAU)

```typescript
interface ITTicket {
  ticketNumber: string;              // "IT-2026-0042"
  title: string;
  description: string;
  category: "hardware" | "software" | "network" | "account" | ...;
  priority: "critique" | "haute" | "moyenne" | "faible";  // ✅ MÊME nomenclature
  status: "nouveau" | "assigné" | "en_cours" | "en_attente" | "résolu" | "fermé";

  // Utilisateur interne
  requestedBy: ObjectId;             // ✅ Référence User (AD)
  assignedTo?: ObjectId;
  relatedAsset?: ObjectId;           // ✅ Lien avec asset IT

  // Workflow
  updates: {...}[];                  // ✅ Similaire à commentaires
  sla: {...};                        // 🆕 Spécifique IT
  resolution: {...};
  satisfaction: {...};
}
```

### 🔑 Points Communs Architecturaux

| Aspect           | Réclamations        | Tickets IT       |
| ---------------- | ------------------- | ---------------- |
| **ID Format**    | REC-XXXX            | IT-YYYY-XXXX     |
| **Priorités**    | ✅ Identiques       | ✅ Identiques    |
| **Workflow**     | 4 étapes            | 6 étapes         |
| **Commentaires** | ✅ Oui              | ✅ Oui (updates) |
| **Historique**   | ✅ Oui              | ✅ Oui           |
| **Assignment**   | Agent municipal     | Agent IT         |
| **Timeline UI**  | ✅ Déjà implémentée | 🆕 Réutilisable  |

---

## 🎨 Réutilisation des Composants UI

### Composants Partagés

Le composant **Timeline** existant peut être réutilisé :

```typescript
// EXISTANT (Réclamations)
const PHASES = [
  { id: "nouveau", label: "Nouveau", color: "#6366f1", next: "en_cours" },
  { id: "en_cours", label: "En cours", color: "#f59e0b", next: "en_attente" },
  { id: "en_attente", label: "En attente validation", color: "#8b5cf6", next: "resolu" },
  { id: "resolu", label: "Résolu", color: "#10b981", next: null },
];

// NOUVEAU (Tickets IT) - Configuration différente, même composant
const IT_PHASES = [
  { id: "nouveau", label: "Nouveau", color: "#6366f1", next: "assigné" },
  { id: "assigné", label: "Assigné", color: "#f59e0b", next: "en_cours" },
  { id: "en_cours", label: "En cours", color: "#f97316", next: "en_attente" },
  { id: "en_attente", label: "En attente", color: "#8b5cf6", next: "résolu" },
  { id: "résolu", label: "Résolu", color: "#10b981", next: "fermé" },
  { id: "fermé", label: "Fermé", color: "#6b7280", next: null },
];

// Composant Timeline RÉUTILISABLE
function Timeline({ commentaires, statut, phases = PHASES }) {
  const phase = phases.find(p => p.id === statut);
  const phaseIndex = phases.findIndex(p => p.id === statut);

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", gap: 0, marginBottom: 16, position: "relative" }}>
        {phases.map((p, i) => (
          // ... même logique de rendu
        ))}
      </div>
      {/* ... reste du composant */}
    </div>
  );
}

// USAGE
// Pour réclamation
<Timeline commentaires={reclamation.commentaires} statut={reclamation.statut} />

// Pour ticket IT
<Timeline commentaires={ticket.updates} statut={ticket.status} phases={IT_PHASES} />
```

### Autres Composants Réutilisables

```typescript
// 1. Badge de priorité - IDENTIQUE
<PrioriteBadge priorite="haute" />
// ✅ Fonctionne pour réclamations ET tickets IT

// 2. Badge de statut - CONFIGURABLE
<Badge statut="en_cours" phases={PHASES} />
<Badge statut="assigné" phases={IT_PHASES} />

// 3. Modal de détails - TEMPLATE RÉUTILISABLE
function DetailsModal({ item, type, onClose, onUpdate }) {
  const isReclamation = type === 'reclamation';
  const phases = isReclamation ? PHASES : IT_PHASES;
  // ... logique commune
}
```

---

## 🔐 Authentification Unifiée

### Avec Active Directory

```typescript
// AVANT (réclamations seulement)
// Citoyens créent compte ReclamTrack
// Agents se connectent avec email/password local

// APRÈS (avec AD intégré)
┌─────────────────────────────────────────────────┐
│  AUTHENTIFICATION MULTI-NIVEAU                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. CITOYENS (public)                           │
│     • Inscription classique                     │
│     • Email + password ReclamTrack              │
│     • Peuvent signaler réclamations             │
│                                                 │
│  2. AGENTS MUNICIPAUX (personnel)               │
│     • Connexion via Active Directory           │
│     • SSO avec credentials AD                   │
│     • Accès réclamations + tableau de bord      │
│                                                 │
│  3. ADMINS IT (personnel technique)             │
│     • Connexion via Active Directory           │
│     • Accès module IT complet                   │
│     • Gestion infrastructure                    │
│                                                 │
│  4. SUPERADMIN (direction)                      │
│     • Accès total (réclamations + IT + admin)   │
│     • Analytics consolidées                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Modèle User Unifié

```typescript
// backend/src/models/User.ts (AMÉLIORÉ)
const UserSchema = new Schema({
  // Identification de base
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  phone: String,

  // Authentication
  password: String, // Pour citoyens
  authMethod: {
    type: String,
    enum: ["local", "ad", "google"],
    default: "local",
  },

  // Active Directory (si authMethod === 'ad')
  adUsername: String, // sAMAccountName
  adSyncedAt: Date,
  adGroups: [String],

  // Rôle & Permissions
  role: {
    type: String,
    enum: ["citizen", "agent", "manager", "admin", "superadmin"],
    default: "citizen",
  },

  // Module Access
  modules: {
    reclamations: { type: Boolean, default: true }, // Tous
    itAdmin: { type: Boolean, default: false }, // Agents IT+
    analytics: { type: Boolean, default: false }, // Managers+
    adminPanel: { type: Boolean, default: false }, // Admins
  },

  organizationId: { type: ObjectId, ref: "Organization" },
});
```

---

## 🔄 Workflows Intégrés

### Scénario 1: Réclamation → Ticket IT

```
🎬 SCÉNARIO : Lampadaire en panne nécessite intervention technique

1. Citoyen crée réclamation
   └─> POST /api/reclamations
       { titre: "Lampadaire éteint rue X", categorie: "Éclairage" }

2. Agent municipal reçoit notification
   └─> Assigne à équipe électrique

3. Équipe découvre problème réseau électrique
   └─> Agent crée TICKET IT lié
       POST /api/it-tickets
       {
         title: "Panne réseau électrique zone 3",
         category: "infrastructure",
         relatedReclamation: "REC-0042"  // ✅ LIEN
       }

4. Admin IT intervient
   └─> Répare infrastructure réseau
       PATCH /api/it-tickets/IT-2026-0010/statut
       { statut: "résolu" }

5. Ticket IT résolu → Notifie agent municipal
   └─> Agent peut résoudre la réclamation
       PATCH /api/reclamations/REC-0042/statut
       { statut: "resolu" }

6. Citoyen reçoit notification de résolution ✅
```

### Scénario 2: Monitoring → Ticket IT Auto-créé

```
🎬 SCÉNARIO : Serveur en surchauffe détectée

1. Monitoring Service détecte CPU > 90%
   └─> Alerte temps réel via Socket.IO

2. Système crée TICKET IT automatiquement
   └─> POST /api/it-tickets
       {
         title: "High CPU on web-server-01",
         category: "hardware",
         priority: "haute",
         source: "auto_monitoring",
         relatedAsset: "ASSET-ID-123"
       }

3. Admin IT reçoit notification push
   └─> Intervient immédiatement

4. Si serveurs impactent services citoyens
   └─> Message automatique sur page réclamations :
       "Service temporairement ralenti - équipe IT intervient"
```

---

## 📡 Notifications Unifiées

### Service de Notification Centralisé

```typescript
// backend/src/services/notificationService.ts

class NotificationService {
  // Notification pour réclamation
  async notifyReclamationUpdate(reclamation: IReclamation, action: string) {
    // Email au citoyen
    await this.sendEmail({
      to: reclamation.email_citoyen,
      subject: `Réclamation ${reclamation.id_reclamation} - ${action}`,
      template: "reclamation-update",
      data: reclamation,
    });

    // WebSocket aux agents
    socketService.broadcast({
      type: "reclamation_updated",
      data: reclamation,
      targetRole: "agent",
    });

    // Kafka event pour analytics
    await kafkaProducer.send({
      topic: "reclamation.updated",
      messages: [{ value: JSON.stringify(reclamation) }],
    });
  }

  // Notification pour ticket IT
  async notifyITTicketUpdate(ticket: ITTicket, action: string) {
    // Email à l'agent assigné
    if (ticket.assignedTo) {
      const user = await User.findById(ticket.assignedTo);
      await this.sendEmail({
        to: user.email,
        subject: `Ticket ${ticket.ticketNumber} - ${action}`,
        template: "it-ticket-update",
        data: ticket,
      });
    }

    // WebSocket aux admins IT
    socketService.broadcast({
      type: "it_ticket_updated",
      data: ticket,
      targetRole: "admin",
    });

    // Si SLA breach
    if (ticket.sla.breached) {
      await this.alertEscalation(ticket);
    }
  }

  // Notification cross-module
  async notifySystemWide(
    message: string,
    severity: "info" | "warning" | "error",
  ) {
    // Tous les utilisateurs connectés
    socketService.broadcastAll({
      type: "system_notification",
      severity,
      message,
    });
  }
}
```

---

## 📊 Analytics Consolidées

### Dashboard Directeur (Superadmin)

```typescript
// GET /api/analytics/consolidated

{
  "period": "last_30_days",

  // Réclamations citoyennes
  "reclamations": {
    "total": 156,
    "nouveau": 12,
    "en_cours": 45,
    "en_attente": 23,
    "resolu": 76,
    "avgResolutionTime": "4.2 jours",
    "topCategories": ["Voirie", "Éclairage", "Déchets"]
  },

  // Tickets IT
  "itTickets": {
    "total": 89,
    "open": 23,
    "resolved": 66,
    "slaCompliance": "92%",
    "avgResolutionTime": "8.5 heures",
    "topCategories": ["hardware", "network", "software"]
  },

  // Infrastructure IT
  "infrastructure": {
    "assets": 234,
    "networkDevices": 45,
    "serversOnline": "98.5%",
    "adUsers": 312,
    "alerts": 7
  },

  // Performance globale
  "performance": {
    "citizenSatisfaction": 4.3,
    "itSlaCompliance": 0.92,
    "systemUptime": 0.997,
    "responseTime": "1.2s"
  }
}
```

### Widget Dashboard Unifié

```typescript
// frontend/src/app/[locale]/(app)/dashboard/page.tsx

export default function UnifiedDashboard() {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* Module Citoyens - Visible par agents+ */}
      {user.modules.reclamations && (
        <Card>
          <CardHeader>
            <CardTitle>Réclamations Citoyennes</CardTitle>
          </CardHeader>
          <CardContent>
            <ReclamationsWidget />
          </CardContent>
        </Card>
      )}

      {/* Module IT - Visible par admins IT+ */}
      {user.modules.itAdmin && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Tickets IT</CardTitle>
            </CardHeader>
            <CardContent>
              <ITTicketsWidget />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              <InfrastructureWidget />
            </CardContent>
          </Card>
        </>
      )}

      {/* Analytics - Visible par managers+ */}
      {user.modules.analytics && (
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Analytics Consolidées</CardTitle>
          </CardHeader>
          <CardContent>
            <ConsolidatedAnalytics />
          </CardContent>
        </Card>
      )}

    </div>
  );
}
```

---

## 🗄️ Collections MongoDB - Vue Complète

```javascript
// ReclamTrack 3.0 - 22 Collections MongoDB

// ========== MODULE CITOYENS (18 existantes) ==========
users; // Utilisateurs (citoyens + agents + admins)
organizations; // Municipalités/Organisations
memberships; // Liaison user-organization
reclamations; // ✅ Réclamations citoyennes
teams; // Équipes d'intervention municipales
assignments; // Attributions équipe-réclamation
interventions; // Interventions terrain
planning_slots; // Plannings équipes
schedulers; // Planification
rosters; // Rosters
leaves; // Congés
vehicles; // Véhicules municipaux
requisitions; // Réquisitions matériel
messages; // Messagerie
knowledge; // Base de connaissance
feedback; // Retours citoyens
audit_logs; // Logs d'audit
staff; // Personnel

// ========== MODULE IT (4 nouvelles) ==========
it_assets; // 🆕 Assets IT (serveurs, PC, etc.)
network_devices; // 🆕 Équipements réseau (switches, routers)
it_tickets; // 🆕 Tickets support IT
ad_sync_logs; // 🆕 Logs synchronisation AD

// ========== TOTAL: 22 COLLECTIONS ==========
```

---

## 🚀 Migration Progressive

### Phase 1: Coexistence (Immédiat)

```bash
# Les 2 modules fonctionnent indépendamment
✅ Réclamations citoyennes (existant)
✅ Module IT (nouveau, isolé)
```

### Phase 2: Authentification AD (Semaine 2-3)

```bash
# Intégration AD seulement pour personnel
✅ Agents municipaux → Login AD
✅ Admins IT → Login AD
✅ Citoyens → Login classique (inchangé)
```

### Phase 3: Notifications Unifiées (Semaine 4)

```bash
# Service de notification centralisé
✅ Socket.IO unifié
✅ Emails via même service
✅ Kafka events consolidés
```

### Phase 4: Analytics Consolidées (Semaine 5)

```bash
# Dashboard directeur avec tout
✅ Réclamations + IT + Infrastructure
✅ Rapports consolidés
```

---

## 🎯 Checklist d'Intégration

### Backend

- [x] Modèle `Reclamation` existant préservé
- [ ] Modèle `ITTicket` créé (similaire mais distinct)
- [ ] Service de notification unifié
- [ ] Middleware AD réutilise auth existant
- [ ] Routes `/api/reclamations` intactes
- [ ] Routes `/api/it-tickets` ajoutées
- [ ] Socket.IO étendu pour IT events

### Frontend

- [ ] Composants Timeline/Badge réutilisés
- [ ] Page `/reclamations` préservée
- [ ] Pages `/it-admin/*` ajoutées
- [ ] Dashboard unifié créé
- [ ] Navigation adaptée selon rôle
- [ ] Notifications consolidées

### Base de Données

- [x] Collection `reclamations` existante ✅
- [ ] Collections IT ajoutées (4 nouvelles)
- [ ] Indexes optimisés
- [ ] Migration script (si nécessaire)

---

## 📖 Documentation

### Pour Développeurs

- `ARCHITECTURE_COMPLETE.md` - Architecture globale
- `IT_ADMINISTRATION_ARCHITECTURE.md` - Module IT détaillé
- `IT_ADMINISTRATION_IMPLEMENTATION.md` - Implémentation IT
- **`IT_CITIZEN_INTEGRATION.md` (ce document)** - Intégration modules

### Pour Utilisateurs

- Guide Citoyens - Comment signaler réclamation
- Guide Agents - Gérer réclamations ET accès IT (selon rôle)
- Guide Admins IT - Administration système complète

---

**Conclusion:** Le module IT s'intègre **harmonieusement** avec le système de réclamations existant, **partage les composants UI**, utilise la **même base d'authentification** (étendue avec AD), et offre une **expérience unifiée** tout en restant **modulaire et indépendant**.

**Date:** 2026-02-17  
**Version:** 1.0
