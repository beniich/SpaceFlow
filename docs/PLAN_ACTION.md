# 🚀 Plan d'Action Frontend — Versionné

**Version** : 2.1.0  
**Date** : 2026-08-02  
**Statut** : 🟢 En cours

---

## 📊 Vue d'ensemble

| Métrique | Avant | Cible |
|----------|-------|-------|
| Score global | 75% | 95% |
| Pages orphelines | 15 | 0 |
| Bugs critiques | 3 | 0 |
| Tests E2E | 0 | 25+ |

---

## ✅ Sprint 1 — Bugs critiques + Pages orphelines (TERMINÉ)

**Durée** : 4h | **Priorité** : 🔴 Critique

- [x] **BUG-001** : `wo.scheduledDate` → `wo.scheduledAt` — `WorkOrders.jsx`
- [x] **BUG-002** : `wo.technicianId` → `wo.assignedTo.firstName + lastName` — `WorkOrders.jsx`
- [x] **BUG-003** : `asset.location?.name` → `asset.building?.name` — `Assets.jsx`
- [x] **TASK-101** : Routes orphelines câblées dans `App.jsx` (9 routes ajoutées)
- [x] **TASK-102** : Leases.jsx connecté (`GET`, `POST`)
- [x] **TASK-103** : Maintenance.jsx connecté (`GET`, `PATCH`)
- [x] **TASK-104** : Spaces.jsx connecté (`GET`)
- [x] **TASK-105** : Logo Spider SVG + composant React cliquable
- [x] **TASK-106** : Bouton mock login supprimé
- [x] **TASK-107** : Icônes PWA SVG source + script génération

---

## ⏳ Sprint 2 — Tests E2E Playwright (EN COURS)

**Durée** : 6h | **Priorité** : 🟠 Haute

| ID | Fichier | Status |
|----|---------|--------|
| TEST-201 | `e2e/leases.spec.ts` | ✅ Créé |
| TEST-202 | `e2e/maintenance.spec.ts` | ✅ Créé |
| TEST-203 | `e2e/spaces.spec.ts` | ✅ Créé |
| TEST-204 | `e2e/spider-logo.spec.ts` | ✅ Créé |
| TEST-205 | `e2e/navigation.spec.ts` | ✅ Créé |
| TEST-206 | `e2e/auth.spec.ts` | ⏳ À créer |
| TEST-207 | `e2e/contacts.spec.ts` | ⏳ À créer |
| TEST-208 | `e2e/deals.spec.ts` | ⏳ À créer |
| TEST-209 | Setup CI E2E | ⏳ À faire |

**Commandes** :
```bash
cd frontend
npx playwright test --project=chromium-desktop
npx playwright show-report
```

---

## ⏳ Sprint 3 — PWA + Mobile

**Durée** : 4h | **Priorité** : 🔴 Haute

- [ ] **FEAT-301** : Générer les 11 icônes PNG via `npm run icons`
- [ ] **FEAT-302** : Manifest PWA complet (`manifest.json`)
- [ ] **FEAT-303** : Service Worker (cache offline)
- [ ] **FEAT-304** : Layout responsive (sidebar mobile)
- [ ] **FEAT-305** : `usePWAInstall` hook + prompt

```bash
cd frontend
npm install -D sharp
npm run icons
```

---

## ⏳ Sprint 4 — SSE + Notifications temps réel

**Durée** : 3h | **Priorité** : 🟠 Haute

- [ ] **FEAT-401** : Backend SSE (`/api/events`)
- [ ] **FEAT-402** : Hook `useSSE` corrigé
- [ ] **FEAT-403** : `NotificationManager` (toasts + sons)
- [ ] **FEAT-404** : Sons d'alerte (`deal_won`, `critical_workorder`)

---

## ⏳ Sprint 5 — Leases PUT/DELETE + stubs restants

**Durée** : 2h | **Priorité** : 🟠 Haute

- [ ] **FEAT-501** : `PUT /api/leases/:id` backend + frontend
- [ ] **FEAT-502** : `DELETE /api/leases/:id` backend + frontend
- [ ] **FEAT-503** : Modal création Work Orders complète
- [ ] **FEAT-504** : Import CSV contacts

---

## 📊 Métriques de succès

| Métrique | Cible | Actuel | Status |
|----------|-------|--------|--------|
| Lighthouse PWA | >90 | - | ⏳ |
| Couverture E2E | 100% flux critiques | 40% | 🟡 |
| Pages orphelines | 0 | 0 | ✅ |
| Bugs P1 | 0 | 0 | ✅ |
| Bundle size | <500KB | 1.4MB | ⚠️ |
| Boutons mock | 0 | 0 | ✅ |

---

## 📝 Changelog

### [2.1.0] — 2026-08-02
**Added**
- Routes orphelines câblées dans `App.jsx`
- Pages Leases, Maintenance, Spaces connectées API
- Logo SVG spider + `SpiderLogo.jsx` cliquable
- 5 fichiers tests Playwright E2E
- Matrice pages↔endpoints (`MATRIX.md`)
- Script génération icônes PWA (`scripts/generate-icons.js`)
- `favicon.svg` + `public/icons/icon.svg`
- `sharp` en devDependency

**Fixed**
- BUG-001 : `wo.scheduledDate` → `wo.scheduledAt`
- BUG-002 : `wo.technicianId` → `wo.assignedTo`
- BUG-003 : `asset.location?.name` → `asset.building?.name`
- Bouton mock login supprimé de `Login.jsx`
- Credentials pré-remplis effacés

**Changed**
- `playwright.config.ts` : 3 projets (desktop, mobile, tablet)
- `package.json` : script `icons`

### [2.0.0] — 2026-07-15
**Added**
- Architecture CAFM complète
- Modules CMMS, Jumeau Numérique, BIM, ERP
- CRM (Contacts, Deals, ScreenSaver)
- Auth Firebase + JWT

---

## 🗓️ Planning global

```
Sprint 1  ────▶  4h   ✅ Terminé
Sprint 2  ────▶  6h   🟡 En cours (5/9 tests créés)
Sprint 3  ────▶  4h   ⏳ À faire
Sprint 4  ────▶  3h   ⏳ À faire
Sprint 5  ────▶  2h   ⏳ À faire
───────────────────────────────
TOTAL     ────▶  19h  ≈ 2.5 jours
```

---

## 🚨 Risques identifiés

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Tests flaky Playwright | Moyenne | Moyen | Retry=2 + selectors robustes |
| Bundle > 500KB | Élevée | Moyen | Code splitting + lazy() |
| SSE proxies (Nginx) | Moyenne | Moyen | `proxy_buffering off` |
| sharp build échec Vercel | Faible | Élevé | Icônes générées localement + commitées |
