# Guide de Migration - ReclamTrack Frontend

## 📅 Date de Réorganisation
**8 février 2026**

---

## 🎯 Objectifs Atteints

✅ **Layout principal amélioré** avec Material Symbols Icons  
✅ **Système de design complet** avec variables CSS harmonisées  
✅ **Support Dark Mode** avec toutes les variables nécessaires  
✅ **Nouvelle structure de dossiers** avec groupes de routes logiques  
✅ **SEO optimisé** avec métadonnées complètes  
✅ **Animations fluides** avec keyframes personnalisées  

---

## 📁 Nouvelle Structure

```
frontend/src/app/
├── layout.tsx                    # ✅ Layout racine (amélioré)
│
├── (public)/                     # ✅ NOUVEAU - Pages publiques
│   ├── layout.tsx                # Layout pour pages publiques
│   └── page.tsx                  # Landing page (améliorée)
│
├── (auth)/                       # ✅ Authentification (inchangé)
│   ├── login/
│   ├── register/
│   └── layout.tsx
│
├── (app)/                        # ✅ NOUVEAU - Application principale
│   ├── layout.tsx                # Layout avec Header + Auth protection
│   │
│   ├── dashboard/                # À migrer depuis (dashboard)
│   ├── complaints/               # À migrer depuis (complaints)
│   ├── teams/                    # À migrer depuis (teams)
│   ├── planning/                 # À migrer depuis (planning)
│   ├── inventory/                # À migrer depuis (inventory)
│   ├── reports/                  # À migrer depuis (reports)
│   ├── admin/                    # À migrer depuis (admin)
│   ├── map/                      # À migrer depuis map
│   ├── messages/                 # À migrer depuis messages
│   ├── fleet/                    # À migrer depuis fleet
│   ├── roster/                   # À migrer depuis roster
│   ├── knowledge/                # À migrer depuis knowledge
│   ├── feedback/                 # À migrer depuis feedback
│   ├── technician/               # À migrer depuis technician
│   ├── analytics/                # À migrer depuis analytics
│   └── settings/                 # À migrer depuis settings
│
└── api/                          # Routes API (si nécessaire)
```

---

## 🔄 Changements Effectués

### 1. Layout Racine (`layout.tsx`)

**Avant :**
```tsx
const inter = Inter({ subsets: ['latin'] });
// Pas de Material Symbols
// Métadonnées basiques
```

**Après :**
```tsx
const inter = Inter({ 
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter'
});
// ✅ Material Symbols Icons ajoutés
// ✅ Métadonnées SEO complètes
// ✅ Open Graph tags
// ✅ Theme colors pour dark mode
```

### 2. CSS Global (`globals.css`)

**Ajouts :**
- ✅ Variables de couleurs complètes (primary-50 à primary-700)
- ✅ Variables sémantiques (success, warning, error, info)
- ✅ Status colors (new, assigned, progress, resolved, closed, urgent)
- ✅ Variables de background harmonisées
- ✅ Variables de border, input, ring
- ✅ Système de radius (sm, md, lg, xl)
- ✅ Système de shadows (sm, md, lg, xl)
- ✅ Variables de transition (fast, base, slow)
- ✅ Dark mode complet avec toutes les overrides
- ✅ Custom scrollbar stylisé
- ✅ Animations (fadeIn, slideInFromLeft, slideInFromRight)
- ✅ Utility classes (glass-effect, card-hover)

### 3. Nouveaux Layouts

#### `(public)/layout.tsx`
- Layout simple pour pages publiques
- Pas d'authentification requise
- Wrapper minimal

#### `(app)/layout.tsx`
- Protection par authentification
- Redirection vers /login si non connecté
- Header intégré
- Loading state élégant

### 4. Landing Page Améliorée

**Changements :**
- ✅ Utilisation des nouvelles classes CSS (`glass-effect`, `card-hover`)
- ✅ Variables CSS harmonisées
- ✅ Animations fluides
- ✅ Dark mode optimisé

---

## 🚀 Prochaines Étapes

### Phase 1 : Migration des Routes ✅ EN COURS

1. **Créer les layouts** ✅ FAIT
   - [x] `(public)/layout.tsx`
   - [x] `(app)/layout.tsx`

2. **Migrer les pages vers (app)/**
   - [ ] Dashboard : `(dashboard)` → `(app)/dashboard`
   - [ ] Complaints : `(complaints)` → `(app)/complaints`
   - [ ] Teams : `(teams)` → `(app)/teams`
   - [ ] Planning : `(planning)` → `(app)/planning`
   - [ ] Inventory : `(inventory)` → `(app)/inventory`
   - [ ] Reports : `(reports)` → `(app)/reports`
   - [ ] Admin : `(admin)` → `(app)/admin`
   - [ ] Autres routes simples

3. **Nettoyer les anciens dossiers**
   - [ ] Supprimer `(ecommerce)` (non pertinent)
   - [ ] Supprimer les duplications
   - [ ] Renommer les dossiers obsolètes en `.old`

### Phase 2 : Mise à Jour des Imports

1. **Mettre à jour les imports relatifs**
   - Chercher tous les imports de type `@/app/...`
   - Mettre à jour vers les nouveaux chemins

2. **Mettre à jour les liens de navigation**
   - Header.tsx
   - Sidebar (si existant)
   - Tous les composants avec des liens

### Phase 3 : Tests

1. **Tester chaque route**
   - [ ] Landing page (/)
   - [ ] Login (/login)
   - [ ] Dashboard (/dashboard)
   - [ ] Toutes les autres routes

2. **Tester l'authentification**
   - [ ] Redirection si non connecté
   - [ ] Accès aux pages protégées
   - [ ] Logout

3. **Tester le responsive**
   - [ ] Mobile
   - [ ] Tablet
   - [ ] Desktop

4. **Tester le dark mode**
   - [ ] Toggle fonctionne
   - [ ] Toutes les couleurs sont correctes
   - [ ] Pas de flash de contenu

---

## 📝 Commandes Utiles

### Lancer le serveur de développement
```bash
cd frontend
npm run dev
```

### Build de production
```bash
cd frontend
npm run build
```

### Vérifier les erreurs TypeScript
```bash
cd frontend
npx tsc --noEmit
```

### Linter
```bash
cd frontend
npm run lint
```

---

## ⚠️ Points d'Attention

### Imports à Vérifier
Après la migration, vérifiez ces imports :
- `@/app/(dashboard)/...` → `@/app/(app)/dashboard/...`
- `@/app/(complaints)/...` → `@/app/(app)/complaints/...`
- etc.

### Hooks d'Authentification
Le layout `(app)/layout.tsx` utilise `useAuth()`. Assurez-vous que :
- Le hook existe dans `@/hooks/useAuth`
- Il retourne `{ user, loading }`
- Il gère correctement l'état de connexion

### Navigation
Mettez à jour tous les liens :
- `/dashboard` reste `/dashboard` (grâce aux route groups)
- `/complaints/new` reste `/complaints/new`
- Les URLs publiques ne changent pas

---

## 🎨 Nouvelles Classes CSS Disponibles

### Utility Classes
```css
.glass-effect        /* Effet glassmorphism */
.card-hover          /* Effet hover pour cartes */
.animate-in          /* Animation d'entrée */
.fade-in             /* Fade in */
.slide-in-from-left-8   /* Slide depuis la gauche */
.slide-in-from-right-8  /* Slide depuis la droite */
```

### Variables CSS
```css
/* Couleurs */
var(--color-primary)
var(--color-success)
var(--color-warning)
var(--color-error)

/* Status */
var(--status-new)
var(--status-progress)
var(--status-resolved)

/* Spacing */
var(--radius)
var(--radius-lg)

/* Shadows */
var(--shadow)
var(--shadow-lg)

/* Transitions */
var(--transition-base)
```

---

## 📊 Statistiques

### Fichiers Modifiés
- ✅ `layout.tsx` (racine)
- ✅ `globals.css`
- ✅ `(public)/layout.tsx` (nouveau)
- ✅ `(public)/page.tsx` (nouveau)
- ✅ `(app)/layout.tsx` (nouveau)

### Fichiers à Migrer
- 🔄 ~38 fichiers `page.tsx`
- 🔄 ~3 fichiers `layout.tsx`

### Lignes de Code
- CSS : +150 lignes (variables et utilities)
- TypeScript : +50 lignes (layouts)

---

## 🆘 Dépannage

### Material Symbols ne s'affichent pas
- Vérifiez que le `<link>` est dans le `<head>`
- Vérifiez la connexion internet
- Essayez de vider le cache du navigateur

### Dark mode ne fonctionne pas
- Vérifiez que `suppressHydrationWarning` est sur `<html>`
- Vérifiez les variables CSS dans `.dark`
- Vérifiez le toggle de theme (si implémenté)

### Routes ne fonctionnent pas
- Vérifiez que les dossiers sont bien nommés
- Vérifiez que `page.tsx` existe dans chaque route
- Redémarrez le serveur de développement

### Erreurs TypeScript
- Vérifiez les imports
- Vérifiez que tous les types sont définis
- Lancez `npm run build` pour voir toutes les erreurs

---

## ✅ Checklist de Migration

- [x] Layout racine amélioré
- [x] CSS global harmonisé
- [x] Groupe (public) créé
- [x] Groupe (app) créé
- [x] Landing page migrée
- [ ] Routes dashboard migrées
- [ ] Routes complaints migrées
- [ ] Routes teams migrées
- [ ] Routes planning migrées
- [ ] Routes inventory migrées
- [ ] Routes reports migrées
- [ ] Routes admin migrées
- [ ] Autres routes migrées
- [ ] Imports mis à jour
- [ ] Navigation mise à jour
- [ ] Tests effectués
- [ ] Build de production réussi
- [ ] Anciens dossiers supprimés

---

## 📞 Support

Pour toute question ou problème :
1. Consultez ce guide
2. Vérifiez le `REORGANIZATION_PLAN.md`
3. Consultez la documentation Next.js sur les Route Groups

---

**Dernière mise à jour :** 8 février 2026  
**Version :** 1.0.0  
**Statut :** 🟡 En cours de migration
