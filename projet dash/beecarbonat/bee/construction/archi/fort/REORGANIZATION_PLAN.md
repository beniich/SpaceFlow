# Plan de Réorganisation - ReclamTrack

## 🎯 Objectifs
1. **Harmoniser la structure des dossiers** frontend
2. **Corriger les problèmes d'affichage** des pages
3. **Éliminer les duplications** et incohérences
4. **Améliorer la maintenabilité** du code

---

## 📊 Problèmes Identifiés

### 1. Structure Désorganisée
- **Duplication de routes** : `(dashboard)/dashboard` et `(dashboard)/page.tsx`
- **Mélange de conventions** : routes groupées `(auth)` et routes normales `admin`
- **Incohérence** : certaines pages dans des groupes, d'autres non

### 2. Structure Actuelle

```
frontend/src/app/
├── (admin)/              # Groupe de routes admin
│   ├── audit/
│   ├── categories/
│   ├── finance/
│   ├── info/
│   ├── integrations/
│   └── users/
├── (auth)/               # Groupe de routes auth
│   ├── login/
│   └── register/
├── (complaints)/         # Groupe de routes réclamations
│   ├── [id]/
│   ├── list/
│   └── new/
├── (dashboard)/          # Groupe de routes dashboard
│   ├── dashboard/        # ❌ DUPLICATION
│   ├── legacy/
│   └── page.tsx
├── (ecommerce)/          # ❌ Pas pertinent pour ReclamTrack
│   ├── cart/
│   ├── checkout/
│   └── pricing/
├── (inventory)/
│   ├── approvals/
│   ├── inventory/
│   └── request/
├── (planning)/
├── (reports)/
│   └── analytics/
├── (teams)/
├── admin/                # ❌ DUPLICATION avec (admin)
├── analytics/            # ❌ DUPLICATION avec (reports)/analytics
├── feedback/
├── fleet/
├── knowledge/
├── map/
├── messages/
├── roster/
├── settings/
├── technician/
├── layout.tsx
└── page.tsx              # Landing page
```

---

## ✅ Structure Proposée (Harmonisée)

```
frontend/src/app/
├── (public)/                    # Pages publiques (sans auth)
│   ├── page.tsx                 # Landing page
│   └── layout.tsx               # Layout public
│
├── (auth)/                      # Authentification
│   ├── login/
│   ├── register/
│   └── layout.tsx
│
├── (app)/                       # Application principale (avec auth)
│   ├── layout.tsx               # Layout avec Header/Sidebar
│   │
│   ├── dashboard/               # Tableau de bord principal
│   │   └── page.tsx
│   │
│   ├── complaints/              # Gestion des réclamations
│   │   ├── page.tsx             # Liste
│   │   ├── new/
│   │   └── [id]/
│   │
│   ├── teams/                   # Gestion des équipes
│   │   ├── page.tsx
│   │   └── [id]/
│   │
│   ├── planning/                # Planning & calendrier
│   │   └── page.tsx
│   │
│   ├── map/                     # Carte géospatiale
│   │   └── page.tsx
│   │
│   ├── inventory/               # Inventaire & stock
│   │   ├── page.tsx
│   │   ├── request/
│   │   └── approvals/
│   │
│   ├── fleet/                   # Gestion de flotte
│   │   └── page.tsx
│   │
│   ├── roster/                  # Planification équipes
│   │   └── page.tsx
│   │
│   ├── messages/                # Messagerie interne
│   │   └── page.tsx
│   │
│   ├── knowledge/               # Base de connaissances
│   │   └── page.tsx
│   │
│   ├── feedback/                # Retours citoyens
│   │   └── page.tsx
│   │
│   ├── technician/              # Interface technicien mobile
│   │   └── page.tsx
│   │
│   ├── reports/                 # Rapports & analytics
│   │   ├── page.tsx
│   │   ├── analytics/
│   │   ├── heatmap/
│   │   └── satisfaction/
│   │
│   ├── admin/                   # Administration système
│   │   ├── page.tsx
│   │   ├── users/
│   │   ├── categories/
│   │   ├── integrations/
│   │   ├── audit/
│   │   ├── info/
│   │   └── costs/
│   │
│   └── settings/                # Paramètres utilisateur
│       ├── page.tsx
│       └── notifications/
│
└── api/                         # Routes API (si nécessaire)
```

---

## 🔧 Actions à Effectuer

### Phase 1 : Préparation
- [x] Analyser la structure actuelle
- [ ] Créer la nouvelle structure de dossiers
- [ ] Identifier les fichiers à déplacer

### Phase 2 : Réorganisation
- [ ] Créer les nouveaux groupes de routes `(public)` et `(app)`
- [ ] Déplacer les pages vers leurs nouveaux emplacements
- [ ] Mettre à jour les layouts
- [ ] Supprimer les dossiers obsolètes

### Phase 3 : Correction des Imports
- [ ] Mettre à jour tous les imports relatifs
- [ ] Corriger les liens de navigation
- [ ] Mettre à jour les redirections

### Phase 4 : Tests & Validation
- [ ] Vérifier que toutes les pages s'affichent correctement
- [ ] Tester la navigation
- [ ] Vérifier l'authentification
- [ ] Valider le build production

---

## 📝 Conventions de Nommage

### Groupes de Routes (Route Groups)
- `(public)` : Pages accessibles sans authentification
- `(auth)` : Pages d'authentification
- `(app)` : Application principale (nécessite authentification)

### Avantages
- ✅ Layouts partagés sans affecter l'URL
- ✅ Organisation logique du code
- ✅ Séparation claire des responsabilités
- ✅ Facilite la gestion des middlewares d'auth

---

## 🎨 Corrections d'Affichage

### Problèmes à Corriger
1. **Layout global** : Ajouter les styles Material Symbols
2. **Dark mode** : Implémenter le toggle correctement
3. **Responsive** : Vérifier tous les breakpoints
4. **Navigation** : Harmoniser Header/Sidebar

### Fichiers à Modifier
- `layout.tsx` : Ajouter les fonts et icônes
- `globals.css` : Harmoniser les variables CSS
- `Header.tsx` : Corriger la navigation
- Tous les `page.tsx` : Vérifier la cohérence visuelle

---

## 🚀 Prochaines Étapes

1. **Valider ce plan** avec vous
2. **Créer un backup** du code actuel
3. **Exécuter la réorganisation** par phases
4. **Tester chaque phase** avant de passer à la suivante
5. **Documenter** les changements

---

## ⚠️ Points d'Attention

- **Ne pas casser** les fonctionnalités existantes
- **Maintenir** la compatibilité avec le backend
- **Préserver** les données et états
- **Tester** après chaque modification majeure
