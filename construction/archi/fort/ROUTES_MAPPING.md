# 🗺️ Cartographie des Routes - ReclamTrack

## 📋 Routes Frontend (Pages Next.js)

### 🏠 Public
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/` | `(public)/page.tsx` | ✅ | - |
| `/system-info` | `(public)/system-info/page.tsx` | ✅ | - |

### 🔐 Authentification
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/login` | `(auth)/login/page.tsx` | ✅ | `/api/auth/login` |
| `/register` | `(auth)/register/page.tsx` | ✅ | `/api/auth/register` |

### 📊 Dashboard
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/dashboard` | `(app)/dashboard/page.tsx` | ✅ | `/api/dashboard/stats` |
| `/dashboard/dashboard` | `(app)/dashboard/dashboard/page.tsx` | ⚠️ DOUBLON | - |
| `/dashboard/legacy` | `(app)/dashboard/legacy/page.tsx` | ⚠️ À SUPPRIMER | - |

### 📝 Réclamations
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/complaints/new` | `(app)/complaints/new/page.tsx` | ✅ | `/api/complaints` (POST) |
| `/complaints/list` | `(app)/complaints/list/page.tsx` | ✅ | `/api/complaints` (GET) |
| `/complaints/[id]` | `(app)/complaints/[id]/page.tsx` | ✅ | `/api/complaints/:id` |

### 👥 Équipes
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/teams` | `(app)/teams/page.tsx` | ✅ | `/api/teams` |
| `/teams/[id]` | `(app)/teams/[id]/page.tsx` | ✅ | `/api/teams/:id` |
| `/teams/planning` | `(app)/teams/planning/page.tsx` | ⚠️ DOUBLON | `/api/planning` |
| `/teams/scheduler` | `(app)/teams/scheduler/page.tsx` | ✅ NOUVEAU | ❌ À CRÉER |

### 📅 Planification
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/planning` | `(app)/planning/page.tsx` | ✅ | `/api/planning` |
| `/roster` | `(app)/roster/page.tsx` | ⚠️ DOUBLON | `/api/planning` |

### 📦 Inventaire
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/inventory/inventory` | `(app)/inventory/inventory/page.tsx` | ⚠️ DOUBLON | `/api/inventory` |
| `/inventory/inventory/advanced` | `(app)/inventory/inventory/advanced/page.tsx` | ⚠️ DOUBLON | `/api/inventory` |
| `/inventory/request` | `(app)/inventory/request/page.tsx` | ✅ | ❌ À CRÉER |
| `/inventory/requisition` | `(app)/inventory/requisition/page.tsx` | ✅ NOUVEAU | ❌ À CRÉER |
| `/inventory/approvals` | `(app)/inventory/approvals/page.tsx` | ✅ | ❌ À CRÉER |

### 🚗 Flotte
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/fleet` | `(app)/fleet/page.tsx` | ✅ | ❌ À CRÉER |

### 📊 Analytics
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/analytics` | `(app)/analytics/page.tsx` | ✅ | `/api/dashboard/stats` |
| `/analytics/satisfaction` | `(app)/analytics/satisfaction/page.tsx` | ✅ NOUVEAU | ❌ À CRÉER |

### 📈 Rapports
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/reports` | `(app)/reports/page.tsx` | ✅ | ❌ À CRÉER |
| `/reports/analytics/heatmap` | `(app)/reports/analytics/heatmap/page.tsx` | ⚠️ DOUBLON | ❌ À CRÉER |
| `/reports/analytics/satisfaction` | `(app)/reports/analytics/satisfaction/page.tsx` | ⚠️ DOUBLON | ❌ À CRÉER |

### 🗺️ Carte
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/map` | `(app)/map/page.tsx` | ✅ | `/api/complaints` |

### 💬 Messages
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/messages` | `(app)/messages/page.tsx` | ✅ | ❌ À CRÉER |

### 📚 Base de Connaissances
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/knowledge` | `(app)/knowledge/page.tsx` | ✅ | ❌ À CRÉER |

### 💬 Feedback
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/feedback` | `(app)/feedback/page.tsx` | ✅ | ❌ À CRÉER |

### 🔧 Technicien
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/technician` | `(app)/technician/page.tsx` | ✅ | `/api/assignments` |

### ⚙️ Paramètres
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/settings` | `(app)/settings/page.tsx` | ✅ | ❌ À CRÉER |
| `/settings/notifications` | `(app)/settings/notifications/page.tsx` | ✅ | ❌ À CRÉER |

### 👑 Administration
| Route | Fichier | Statut | Backend API |
|-------|---------|--------|-------------|
| `/admin/users` | `(app)/admin/users/page.tsx` | ✅ | ❌ À CRÉER |
| `/admin/categories` | `(app)/admin/categories/page.tsx` | ✅ | ❌ À CRÉER |
| `/admin/audit` | `(app)/admin/audit/page.tsx` | ✅ | ❌ À CRÉER |
| `/admin/integrations` | `(app)/admin/integrations/page.tsx` | ✅ | ❌ À CRÉER |
| `/admin/info` | `(app)/admin/info/page.tsx` | ✅ | - |
| `/admin/finance/costs` | `(app)/admin/finance/costs/page.tsx` | ✅ | ❌ À CRÉER |

---

## 🔌 Routes Backend (API Express)

### ✅ Routes Existantes

| Endpoint | Méthode | Fichier | Description |
|----------|---------|---------|-------------|
| `/api/auth/register` | POST | `routes/auth.ts` | Inscription utilisateur |
| `/api/auth/login` | POST | `routes/auth.ts` | Connexion utilisateur |
| `/api/auth/me` | GET | `routes/auth.ts` | Profil utilisateur |
| `/api/complaints` | GET | `routes/complaints.ts` | Liste des réclamations |
| `/api/complaints` | POST | `routes/complaints.ts` | Créer réclamation |
| `/api/complaints/:id` | GET | `routes/complaints.ts` | Détails réclamation |
| `/api/complaints/:id` | PUT | `routes/complaints.ts` | Modifier réclamation |
| `/api/complaints/:id` | DELETE | `routes/complaints.ts` | Supprimer réclamation |
| `/api/teams` | GET | `routes/teams.ts` | Liste des équipes |
| `/api/teams/:id` | GET | `routes/teams.ts` | Détails équipe |
| `/api/assignments` | GET | `routes/assignments.ts` | Liste des assignations |
| `/api/assignments` | POST | `routes/assignments.ts` | Créer assignation |
| `/api/planning` | GET | `routes/planning.ts` | Planning interventions |
| `/api/planning` | POST | `routes/planning.ts` | Créer intervention |
| `/api/dashboard/stats` | GET | `routes/dashboard.ts` | Statistiques dashboard |
| `/api/inventory` | GET | `routes/inventory.ts` | Liste inventaire |
| `/api/inventory` | POST | `routes/inventory.ts` | Ajouter article |

### ❌ Routes Manquantes (À Créer)

| Endpoint | Méthode | Description | Priorité |
|----------|---------|-------------|----------|
| `/api/requisitions` | GET | Liste des réquisitions | 🔴 HAUTE |
| `/api/requisitions` | POST | Créer réquisition | 🔴 HAUTE |
| `/api/requisitions/:id` | GET | Détails réquisition | 🔴 HAUTE |
| `/api/requisitions/:id/transition` | POST | Changer statut réquisition | 🔴 HAUTE |
| `/api/inventory/items/search` | GET | Rechercher articles | 🔴 HAUTE |
| `/api/analytics/satisfaction` | GET | Métriques satisfaction | 🟡 MOYENNE |
| `/api/scheduler/shifts` | GET | Liste des shifts | 🟡 MOYENNE |
| `/api/scheduler/shifts` | POST | Créer shift | 🟡 MOYENNE |
| `/api/scheduler/assignments` | GET | Assignations shifts | 🟡 MOYENNE |
| `/api/scheduler/assignments` | POST | Assigner membre | 🟡 MOYENNE |
| `/api/fleet/vehicles` | GET | Liste véhicules | 🟢 BASSE |
| `/api/fleet/vehicles/:id` | GET | Détails véhicule | 🟢 BASSE |
| `/api/messages` | GET | Liste messages | 🟢 BASSE |
| `/api/messages` | POST | Envoyer message | 🟢 BASSE |
| `/api/knowledge/sops` | GET | Liste SOPs | 🟢 BASSE |
| `/api/feedback` | GET | Liste feedback | 🟢 BASSE |
| `/api/feedback` | POST | Soumettre feedback | 🟢 BASSE |
| `/api/admin/users` | GET | Gestion utilisateurs | 🟡 MOYENNE |
| `/api/admin/categories` | GET | Gestion catégories | 🟡 MOYENNE |
| `/api/admin/audit` | GET | Logs d'audit | 🟢 BASSE |

---

## 🔧 Actions Recommandées

### 1️⃣ Nettoyage des Doublons (URGENT)

**À Supprimer:**
- `(app)/dashboard/dashboard/page.tsx` → Utiliser `/dashboard`
- `(app)/dashboard/legacy/page.tsx` → Obsolète
- `(app)/inventory/inventory/page.tsx` → Renommer en `/inventory`
- `(app)/inventory/inventory/advanced/page.tsx` → Fusionner avec `/inventory`
- `(app)/reports/analytics/heatmap/page.tsx` → Déjà dans `/map`
- `(app)/reports/analytics/satisfaction/page.tsx` → Déjà dans `/analytics/satisfaction`

**À Fusionner:**
- `/teams/planning` + `/planning` + `/roster` → Garder `/planning` uniquement

### 2️⃣ Routes Backend Prioritaires

**Créer immédiatement:**
1. `routes/requisitions.ts` - Gestion des réquisitions de matériel
2. `routes/scheduler.ts` - Gestion des shifts d'équipes
3. `routes/analytics.ts` - Métriques et satisfaction

**Créer ensuite:**
4. `routes/fleet.ts` - Gestion de la flotte
5. `routes/messages.ts` - Messagerie interne
6. `routes/admin.ts` - Administration

### 3️⃣ Structure Recommandée

```
frontend/src/app/(app)/
├── dashboard/              # Tableau de bord principal
├── complaints/             # Gestion réclamations
│   ├── new/
│   ├── list/
│   └── [id]/
├── teams/                  # Gestion équipes
│   ├── [id]/
│   └── scheduler/          # Planning shifts
├── planning/               # Planning interventions (UNIQUE)
├── inventory/              # Gestion inventaire
│   ├── requisition/        # Nouvelles réquisitions
│   └── approvals/          # Approbations
├── analytics/              # Analytics & rapports
│   └── satisfaction/
├── map/                    # Carte & heatmap
├── fleet/                  # Gestion flotte
├── messages/               # Messagerie
├── knowledge/              # Base de connaissances
├── feedback/               # Feedback citoyens
├── settings/               # Paramètres
└── admin/                  # Administration
```

---

## 📊 Statistiques

- **Total pages frontend:** 40
- **Doublons à nettoyer:** 7
- **Routes backend existantes:** 16
- **Routes backend manquantes:** 19
- **Taux de couverture API:** 45%
