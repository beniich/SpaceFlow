# 📚 ReclamTrack - Index de la Documentation d'Architecture

> **Navigation complète de la documentation technique**  
> Dernière mise à jour: 2026-02-17

---

## 🎯 Documents Principaux

### 1. 📖 **QUICK_REFERENCE.md** - Guide de Référence Rapide

**Pour qui:** Tous les développeurs  
**Quand l'utiliser:** Consultation rapide quotidienne  
**Contenu:**

- Commandes essentielles
- Stack technologique
- Routes API principales
- Raccourcis et astuces
- Dépannage rapide

[→ Ouvrir QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

### 2. 🏗️ **ARCHITECTURE_COMPLETE.md** - Documentation Complète

**Pour qui:** Architectes, Lead Developers, Nouveaux arrivants  
**Quand l'utiliser:** Compréhension approfondie du système  
**Contenu:**

- Vue d'ensemble complète
- Architecture détaillée (Frontend, Backend, DB, Microservices)
- Stack technologique exhaustive
- Flux de données complets
- Sécurité et monitoring
- Guides de déploiement
- 12 sections détaillées

[→ Ouvrir ARCHITECTURE_COMPLETE.md](./ARCHITECTURE_COMPLETE.md)

---

### 3. 📐 **ARCHITECTURE_DIAGRAMS.md** - Diagrammes Visuels

**Pour qui:** Visual learners, Présentations, Onboarding  
**Quand l'utiliser:** Visualisation de l'architecture  
**Contenu:**

- Diagramme système global (ASCII art)
- Flux de création de réclamation (step-by-step)
- Schéma base de données (ERD)
- Flux d'authentification JWT
- Architecture de déploiement
- Tous les diagrammes en format texte

[→ Ouvrir ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)

---

### 4. 🚀 **QUICKSTART.md** - Guide de Démarrage Rapide

**Pour qui:** Nouveaux développeurs  
**Quand l'utiliser:** Premier jour, setup initial  
**Contenu:**

- Installation pas à pas
- Configuration de l'environnement
- Premier lancement
- Vérifications de santé

[→ Ouvrir QUICKSTART.md](./QUICKSTART.md)

---

### 5. 🏛️ **ARCHITECTURE.md** - Vue d'Ensemble Originale

**Pour qui:** Aperçu rapide de la structure  
**Quand l'utiliser:** Introduction au projet  
**Contenu:**

- Structure multi-projets
- Ports assignés
- Commandes centralisées
- Workflows de développement

[→ Ouvrir ARCHITECTURE.md](./ARCHITECTURE.md)

---

### 6. 🖥️ **IT_ADMINISTRATION_ARCHITECTURE.md** - Module IT & Active Directory

**Pour qui:** Architectes, Admins Système, Lead Developers  
**Quand l'utiliser:** Comprendre l'intégration IT/AD  
**Contenu:**

- Architecture module IT complet
- Intégration Active Directory (LDAP)
- Gestion des assets IT
- Monitoring réseau (SNMP)
- Helpdesk IT & tickets
- 4 nouveaux microservices
- Modèles de données IT

[→ Ouvrir IT_ADMINISTRATION_ARCHITECTURE.md](./IT_ADMINISTRATION_ARCHITECTURE.md)

---

### 7. 💻 **IT_ADMINISTRATION_IMPLEMENTATION.md** - Implémentation Module IT

**Pour qui:** Développeurs Backend & Frontend  
**Quand l'utiliser:** Implémentation concrète du module IT  
**Contenu:**

- Routes API complètes (4 routes principales)
- Services Active Directory
- Composants frontend IT
- Configuration LDAP/SNMP
- Sécurité & permissions
- Métriques Prometheus
- Installation & dépendances

[→ Ouvrir IT_ADMINISTRATION_IMPLEMENTATION.md](./IT_ADMINISTRATION_IMPLEMENTATION.md)

---

### 8. 🎯 **IT_MODULE_INTEGRATION_PLAN.md** - Plan d'Intégration IT

**Pour qui:** Project Managers, Équipe Développement  
**Quand l'utiliser:** Planification et suivi du projet IT  
**Contenu:**

- Roadmap d'implémentation (10 semaines)
- 4 nouvelles collections MongoDB
- ~30 nouvelles routes API
- 20 nouvelles pages frontend
- 4 nouveaux microservices
- Checklist de démarrage
- Métriques de succès

[→ Ouvrir IT_MODULE_INTEGRATION_PLAN.md](./IT_MODULE_INTEGRATION_PLAN.md)

---

### 9. 🔗 **IT_CITIZEN_INTEGRATION.md** - Intégration des Modules

**Pour qui:** Tous les développeurs  
**Quand l'utiliser:** Comprendre comment les 2 modules coexistent  
**Contenu:**

- Synergies entre module Citoyens et IT
- Comparaison des modèles de données
- Réutilisation des composants UI (Timeline, Badges)
- Authentification AD unifiée
- Workflows intégrés (réclamation → ticket IT)
- Notifications consolidées
- Analytics cross-module

[→ Ouvrir IT_CITIZEN_INTEGRATION.md](./IT_CITIZEN_INTEGRATION.md)

---

### 10. 🎣 **IT_REACT_HOOKS_GUIDE.md** - Hooks React pour Module IT

**Pour qui:** Développeurs Frontend  
**Quand l'utiliser:** Implémentation des hooks IT  
**Contenu:**

- `useITTickets()` - Tickets IT (pattern identique à `useReclamations`)
- `useITAssets()` - Gestion assets IT
- `useNetworkDevices()` - Monitoring réseau
- `useADUsers()` - Utilisateurs Active Directory
- Interfaces TypeScript complètes
- Exemples d'usage dans composants
- Configuration backend associée

[→ Ouvrir IT_REACT_HOOKS_GUIDE.md](./IT_REACT_HOOKS_GUIDE.md)

---

## 📂 Documentation Complémentaire

### Déploiement & DevOps

#### **DEPLOYMENT.md**

Guide complet de déploiement en production

- Configuration serveur
- Docker & Docker Compose
- CI/CD avec GitHub Actions
- Scaling et haute disponibilité

[→ Ouvrir DEPLOYMENT.md](./DEPLOYMENT.md)

#### **CI_CD_MANUAL.md**

Manuel CI/CD et automatisation

- Workflows GitHub Actions
- Tests automatisés
- Build et déploiement automatique

[→ Ouvrir CI_CD_MANUAL.md](./CI_CD_MANUAL.md)

#### **GITHUB_SECRETS.md**

Configuration des secrets GitHub

- Variables d'environnement
- Secrets pour CI/CD

[→ Ouvrir GITHUB_SECRETS.md](./GITHUB_SECRETS.md)

---

### Configuration & Intégrations

#### **GOOGLE_OAUTH.md**

Configuration OAuth Google complète

- Setup Google Cloud Console
- Configuration backend
- Configuration frontend
- Troubleshooting

[→ Ouvrir GOOGLE_OAUTH.md](./GOOGLE_OAUTH.md)

#### **GOOGLE_OAUTH_QUICKSTART.md**

Version condensée de la configuration OAuth

- Setup rapide
- Étapes essentielles

[→ Ouvrir GOOGLE_OAUTH_QUICKSTART.md](./GOOGLE_OAUTH_QUICKSTART.md)

#### **GRAFANA_GUIDE.md**

Guide d'utilisation Grafana

- Configuration dashboards
- Métriques disponibles
- Alerting

[→ Ouvrir GRAFANA_GUIDE.md](./GRAFANA_GUIDE.md)

---

### Guides de Développement

#### **CONTRIBUTING.md**

Guide de contribution au projet

- Standards de code
- Process de PR
- Code review guidelines
- Bonnes pratiques

[→ Ouvrir CONTRIBUTING.md](./CONTRIBUTING.md)

#### **CODE_HARMONY_GUIDE.md**

Guide d'harmonisation du code

- Conventions de nommage
- Structure des fichiers
- Patterns recommandés

[→ Ouvrir CODE_HARMONY_GUIDE.md](./CODE_HARMONY_GUIDE.md)

#### **HARMONISATION_ROUTES.md**

Harmonisation des routes API

- Mapping routes frontend/backend
- Conventions de nommage
- Exemples

[→ Ouvrir HARMONISATION_ROUTES.md](./HARMONISATION_ROUTES.md)

---

### Analyse & Planning

#### **INTEGRATION_ANALYSIS.md**

Analyse de l'intégration mono-application

- État avant/après
- Décisions d'architecture
- Analyses techniques

[→ Ouvrir INTEGRATION_ANALYSIS.md](./INTEGRATION_ANALYSIS.md)

#### **ACTION_PLAN.md**

Plan d'action détaillé

- Features à implémenter
- Roadmap
- Priorités

[→ Ouvrir ACTION_PLAN.md](./ACTION_PLAN.md)

#### **PAGES_INDEX.md**

Index complet des pages

- Liste toutes les pages (30+)
- Routes et URLs
- Descriptions

[→ Ouvrir PAGES_INDEX.md](./PAGES_INDEX.md)

#### **PAGES_ANALYSIS.md**

Analyse détaillée des pages

- Technologies utilisées
- Composants principaux
- État actuel

[→ Ouvrir PAGES_ANALYSIS.md](./PAGES_ANALYSIS.md)

#### **PAGE_RELATIONSHIPS.md**

Relations entre pages

- Navigation flows
- Dépendances
- Architecture de routing

[→ Ouvrir PAGE_RELATIONSHIPS.md](./PAGE_RELATIONSHIPS.md)

---

### État du Projet

#### **STATUS.md**

État actuel du projet

- Features implémentées
- En cours
- À faire

[→ Ouvrir STATUS.md](./STATUS.md)

#### **ETAT_ACTUEL_APPLICATION.md**

État détaillé de l'application (Français)

- Fonctionnalités
- Architecture
- Points d'attention

[→ Ouvrir ETAT_ACTUEL_APPLICATION.md](./ETAT_ACTUEL_APPLICATION.md)

#### **SUMMARY.md**

Résumé exécutif

- Vue d'ensemble
- Décisions clés
- Prochaines étapes

[→ Ouvrir SUMMARY.md](./SUMMARY.md)

#### **EXECUTIVE_SUMMARY.md**

Résumé pour la direction

- Business overview
- ROI
- Metrics

[→ Ouvrir EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)

---

### Rapports & Analyses

#### **PERFORMANCE_REPORT.md**

Rapport de performance

- Métriques
- Optimisations
- Recommandations

[→ Ouvrir PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md)

#### **RAPPORT_HARMONIE_API.md**

Rapport d'harmonisation API

- Cohérence des endpoints
- Standards appliqués

[→ Ouvrir RAPPORT_HARMONIE_API.md](./RAPPORT_HARMONIE_API.md)

#### **DEVELOPER_HARMONY_REPORT.md**

Rapport d'harmonisation développeur

- DX improvements
- Tooling

[→ Ouvrir DEVELOPER_HARMONY_REPORT.md](./DEVELOPER_HARMONY_REPORT.md)

---

### Migration & Refactoring

#### **MIGRATION_GUIDE.md**

Guide de migration

- Migrations de données
- Versions upgrades
- Breaking changes

[→ Ouvrir MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

#### **REORGANIZATION_PLAN.md**

Plan de réorganisation

- Refactoring du code
- Nouvelle structure

[→ Ouvrir REORGANIZATION_PLAN.md](./REORGANIZATION_PLAN.md)

#### **REORGANIZATION_COMPLETE.md**

Rapport de réorganisation complété

- Changements effectués
- Impacts

[→ Ouvrir REORGANIZATION_COMPLETE.md](./REORGANIZATION_COMPLETE.md)

---

### Guides Spécialisés

#### **ROUTES_MAPPING.md**

Mapping complet des routes

- Routes frontend
- Endpoints backend
- Correspondances

[→ Ouvrir ROUTES_MAPPING.md](./ROUTES_MAPPING.md)

#### **TEST_NOTIFICATIONS.md**

Tests du système de notifications

- Tests Socket.IO
- Tests emails
- Validations

[→ Ouvrir TEST_NOTIFICATIONS.md](./TEST_NOTIFICATIONS.md)

---

## 🔧 Scripts & Outils

### **START_DEV.ps1 / START_DEV.bat**

Scripts de démarrage développement

```bash
./START_DEV.ps1    # PowerShell
./START_DEV.bat    # Batch
```

### **TEST.ps1**

Script de tests

```bash
./TEST.ps1
```

### **LANCER.cmd**

Lanceur rapide

```bash
./LANCER.cmd
```

---

## 📖 Comment Utiliser Cette Documentation

### Pour les Nouveaux Développeurs

1. **Jour 1:** Lire `QUICKSTART.md` → Setup environnement
2. **Jour 2-3:** Lire `ARCHITECTURE_COMPLETE.md` → Comprendre le système
3. **Jour 4+:** Utiliser `QUICK_REFERENCE.md` → Référence quotidienne
4. **Ongoing:** Consulter `ARCHITECTURE_DIAGRAMS.md` → Visualisations

### Pour les Développeurs Expérimentés

1. **Référence rapide:** `QUICK_REFERENCE.md`
2. **Deep dive:** `ARCHITECTURE_COMPLETE.md` (sections spécifiques)
3. **Visualisation:** `ARCHITECTURE_DIAGRAMS.md`

### Pour les Architectes

1. **Vue d'ensemble:** `ARCHITECTURE_COMPLETE.md`
2. **Diagrammes:** `ARCHITECTURE_DIAGRAMS.md`
3. **Analyses:** `INTEGRATION_ANALYSIS.md`, `PERFORMANCE_REPORT.md`

### Pour les DevOps

1. **Déploiement:** `DEPLOYMENT.md`
2. **CI/CD:** `CI_CD_MANUAL.md`
3. **Monitoring:** `GRAFANA_GUIDE.md`

### Pour les Product Managers

1. **État projet:** `STATUS.md`, `ETAT_ACTUEL_APPLICATION.md`
2. **Roadmap:** `ACTION_PLAN.md`
3. **Features:** `PAGES_INDEX.md`

---

## 🔍 Recherche Rapide

### Par Sujet

| Sujet                     | Document                                           |
| ------------------------- | -------------------------------------------------- |
| **Installation**          | QUICKSTART.md                                      |
| **Architecture complète** | ARCHITECTURE_COMPLETE.md                           |
| **Diagrammes**            | ARCHITECTURE_DIAGRAMS.md                           |
| **API Routes**            | QUICK_REFERENCE.md, ROUTES_MAPPING.md              |
| **Base de données**       | ARCHITECTURE_COMPLETE.md (section DB)              |
| **Authentification**      | ARCHITECTURE_DIAGRAMS.md (Flux auth)               |
| **Microservices**         | ARCHITECTURE_COMPLETE.md (section Microservices)   |
| **Kafka**                 | ARCHITECTURE_COMPLETE.md, ARCHITECTURE_DIAGRAMS.md |
| **Frontend**              | ARCHITECTURE_COMPLETE.md (section Frontend)        |
| **Backend**               | ARCHITECTURE_COMPLETE.md (section Backend)         |
| **Sécurité**              | ARCHITECTURE_COMPLETE.md (section Sécurité)        |
| **Monitoring**            | GRAFANA_GUIDE.md, ARCHITECTURE_COMPLETE.md         |
| **Déploiement**           | DEPLOYMENT.md                                      |
| **CI/CD**                 | CI_CD_MANUAL.md                                    |
| **Google OAuth**          | GOOGLE_OAUTH.md                                    |
| **Pages**                 | PAGES_INDEX.md, PAGES_ANALYSIS.md                  |
| **Contributing**          | CONTRIBUTING.md                                    |

---

## 📊 Statistiques du Projet

### Lignes de Code (approximatif)

- **Backend:** ~15,000 lignes (TypeScript)
- **Frontend:** ~35,000 lignes (TypeScript/TSX)
- **Microservices:** ~8,000 lignes
- **Total:** ~58,000 lignes

### Fichiers

- **Backend:** 82 fichiers
- **Frontend:** 311 fichiers
- **Documentation:** 50+ fichiers Markdown

### Collections MongoDB

- **18 collections** principales
- **Multi-tenant** architecture

### API Endpoints

- **26 routes** principales
- **100+ endpoints** au total

### Pages Frontend

- **30+ pages** Next.js
- **120+ composants** React

### Microservices

- **6 microservices** actifs
- **1 API Gateway**

---

## 🆕 Mises à Jour Récentes

**2026-02-17:**

- ✅ Ajout `ARCHITECTURE_COMPLETE.md` (documentation complète)
- ✅ Ajout `ARCHITECTURE_DIAGRAMS.md` (diagrammes visuels)
- ✅ Ajout `QUICK_REFERENCE.md` (référence rapide)
- ✅ Ajout `ARCHITECTURE_INDEX.md` (ce fichier)

**2026-02-16:**

- ✅ Intégration outils qualité de code
- ✅ Tests monitoring access

**2026-02-15:**

- ✅ Modernisation features
- ✅ Intégration Zustand & NextAuth

---

## 📝 Notes Importantes

### Documentation en Français

Plusieurs documents sont en français pour faciliter la communication avec l'équipe locale:

- `ETAT_ACTUEL_APPLICATION.md`
- `GUIDE_HARMONISATION.md`
- `INSTRUCTIONS_DEMARRAGE.md`

### Documentation Archivée

Les documents obsolètes sont dans `_archive/` mais restent accessibles pour référence historique.

### Documentation Vivante

Cette documentation évolue avec le projet. N'hésitez pas à:

- Proposer des améliorations via PR
- Signaler des informations obsolètes
- Ajouter des sections manquantes

---

## 🤝 Contribution à la Documentation

Pour améliorer cette documentation:

1. **Identifier** le document à modifier
2. **Éditer** en respectant le format Markdown
3. **Tester** les liens et exemples de code
4. **Commit** avec message clair
5. **PR** avec description des changements

Voir `CONTRIBUTING.md` pour plus de détails.

---

## 📞 Support

Pour des questions sur la documentation:

- **GitHub Issues:** Questions techniques
- **Équipe Dev:** Questions d'architecture
- **Lead Dev:** Décisions stratégiques

---

**Version de l'index:** 1.0  
**Dernière mise à jour:** 2026-02-17  
**Mainteneur:** ReclamTrack Dev Team

---

## 🎓 Ressources Externes Recommandées

### Technologies Core

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)

### Microservices & Messaging

- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Microservices Patterns](https://microservices.io/patterns/)
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)

### Frontend Libraries

- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query/latest)
- [Socket.IO](https://socket.io/docs/)
- [Shadcn/ui](https://ui.shadcn.com/)

### DevOps & Monitoring

- [Docker Documentation](https://docs.docker.com/)
- [Prometheus](https://prometheus.io/docs/)
- [Grafana](https://grafana.com/docs/)

---

**Fin de l'index** - Bonne lecture ! 📚
