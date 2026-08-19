# ReclamTrack → GMAO Industrielle
## Plan de Transformation Stratégique

**IMPORTANT**
ReclamTrack possède déjà une base solide : Auth SOC 2, Design Studio technique, API REST, dashboard temps réel. L'orientation GMAO réutilise et étend ces fondations au lieu de repartir de zéro.

### 🎯 Qu'est-ce qu'un GMAO ?
GMAO = Gestion de Maintenance Assistée par Ordinateur
Un GMAO permet de :
- Gérer le parc d'équipements (machines, installations)
- Planifier la maintenance préventive et corrective
- Créer et suivre des ordres de travail (OT)
- Gérer le stock de pièces détachées (MRO)
- Produire des KPIs de fiabilité (MTBF, MTTR, OEE)

### 🗺️ Vision Produit
ReclamTrack GMAO
├── 🏗️ Asset Management       → Parc équipements / installations [TERMINE ✅]
├── 🔧 Ordres de Travail       → OT correctifs & préventifs [TERMINE ✅]
├── 📅 Maintenance Préventive  → Plans & calendriers PM [TERMINE ✅]
├── 📦 Stocks MRO              → Pièces détachées & fournisseurs [TERMINE ✅]
├── 📊 KPIs & Rapports         → MTBF, MTTR, OEE, coûts [TERMINE ✅]
├── 📱 App Technicien          → QR Scan & Saisie Mobile [TERMINE ✅]
├── 🚨 Intégration Complaint   → Conversion Ticket → OT [EN COURS ⏳]
└── 🎨 Design Studio Link      → Schémas interactifs GMAO [A FAIRE ⏳]

---

### ✅ Phase 1 — Asset Management
- Création du Registre équipements (Site → Zone → Machine).
- Fiche équipement avec specs techniques et statuts.

### ✅ Phase 2 — Ordres de Travail OT
- Système d'OT Correctif/Préventif avec Checklists.

### ✅ Phase 3 — Maintenance Préventive PM
- Plans de maintenance récurrents et Vue Calendrier/Gantt.

### ✅ Phase 4 — Stocks MRO
- Catalogue de pièces détachées, alertes de stock et mouvements.

### ✅ Phase 5 — KPIs & Reporting
- Tableau de bord industriel Performance, Disponibilité, Fiabilité (MTTR/MTBF).

### ✅ Phase 6 — App Technicien (Tactile)
- Interface mobile-first pour le terrain.
- Passerelle de scan QR Code.

### ⏳ Phase 7 — Intégration Hub & Flux Automatisés
- **Objectif** : Fluidifier le passage de la réclamation à la réparation.
- Automatisation : Une réclamation "Panne Grave" génère un pré-Work Order.
- Linking : Rattachement direct des équipements aux tickets existants.

### ⏳ Phase 8 — Digital Twin & Design Studio (WOW Factor)
- Intégration des schémas techniques du Design Studio avec les données GMAO.
- Cliquer sur un composant dans le schéma ouvre sa fiche maintenance.
