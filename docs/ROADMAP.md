# Roadmap Stratégique Détaillée — BeeCarbonat

Voici la roadmap opérationnelle complète, structurée par horizon avec une granularité suffisante pour piloter chaque sprint, avec critères de succès, dépendances, arbitrages et points de vigilance.

---

## 🎯 Fondations Stratégiques Communes (tous horizons)

Avant de plonger dans les horizons, trois engagements transverses permanents :

| Engagement | Description | KPI |
|-----------|-------------|-----|
| **Multi-tenancy strict** | Isolation RLS + Prisma extensions | Audit sécurité trimestriel |
| **API-first** | Backend exposé, frontend comme un consommateur | 100% des features via API |
| **EU-data residency** | Hébergement Frankfurt/Amsterdam, pas de transfert | Certification SOC2 / ISO 27001 sous 18 mois |

---

## 🟢 Horizon 1 — Fondations (0-12 mois)

**Objectif** : produit CAFM opérationnel avec un différenciateur net, **3 à 5 premiers clients payants**.

### Thème 1.1 — Cœur Métier CAFM (M1-M6)

#### M1-M2 : Modèle de Données Maître
- **Schéma asset canonique** : `Asset` (hiérarchique, support multi-niveaux bâtiment/étage/local/équipement)
- **Standards supportés** : COBie Lite, IFC minimal, bPRO
- **Décision structurante** : modèle `Tenant` strict avec RLS Postgres

```prisma
// Aperçu - structure cible
model Asset {
  id          String   @id @default(uuid())
  tenantId    String   // ← RLS enforced
  parentId    String?
  type        AssetType
  code        String
  name        String
  geometry    Json?    // bounding box minimal
  bimRef      String?  // GUID IFC externe
  location    Geography(Point, 4326)?  // PostGIS
  // ...
}
```

#### M3-M4 : Work Orders & Plans 2D
- File des WO : filters status/priority/assignee
- Templates WO par type (préventif/correctif/réglementaire)
- Upload plans (PDF, image) avec calques annotables
- **Mobile-first** : écran WO optimisé terrain (signature, photo, offline)

#### M5-M6 : Contrats & Fournisseurs
- Modèles : contrat de maintenance, garantie, SLA
- Liens : contrat ↔ asset ↔ WO
- Alertes renouvellement automatiques

**Critères de sortie Horizon 1** :
- ✅ Un FMO peut créer 50 assets, 20 WO, gérer 5 contrats sans Excel
- ✅ Export CSV complet des opérations
- ✅ Three users tiers (Admin/FM/Technicien) fonctionnels

---

### Thème 1.2 — Différenciateur ESG (M4-M10)

**Pourquoi en parallèle** : si vous attendez la fin du cœur CAFM, vous lancez "un CAFM de plus".

#### M4-M6 : Acquisition de Données Environnementales
- **Compteurs** (eau, gaz, électricité) rattachés à un asset
- **Factures énergétiques** : parser PDF → scope 1/2/3 automatique
- **Données de référence** : facteurs d'émission ADEME / DEFRA / IEA (versionnés)

#### M7-M9 : Premier Dashboard ESG
- **Energy intensity** (kWh/m²/an) par asset et agrégé par portefeuille
- **Scope 1, 2, 3** (partial — scope 3 catégorie 13 uniquement pour démarrer)
- **Export CSRD-ready** : XBRL ou CSV structuré pour cabinet d'audit

```tsx
// Format export cible
interface CSRDExport {
  reportingPeriod: { from: Date; to: Date };
  entity: { lei?: string; name: string };
  scope1: { tCO2e: number; breakdown: ... };
  scope2: { location: number; market: number };
  scope3_cat13: { tCO2e: number; downstream: ... };
  confidence: { high: number; medium: number; low: number };
}
```

#### M10 : Premier Rapport Audit-Ready
- Génération PDF automatique avec : empreinte, intensité, méthodologie, sources
- Signé cryptographiquement (SHA-256 du contenu)

**Critères de sortie ESG H1** :
- ✅ Un asset peut afficher son intensité énergétique avec source
- ✅ Export CSRD basique pour un site pilote
- ✅ Facture → kWh → kgCO2e automatique pour 80% des cas

---

### Thème 1.3 — Intégrations Critiques (M6-M12)

#### ERP Connectors
- **Odoo** (xmlrpc + REST) : work orders synchronisés, assets importés
- **SAP** (RFC/BAPI via node-rfc) : postes immobilisations, hiérarchie technique
- **Pattern obligatoire** : queue BullMQ + retry exponentiel + idempotency keys

```ts
// Pattern recommandé
const erpQueue = new Queue('erp-sync', { connection: redis });

erpQueue.process('asset-sync', async (job) => {
  const breaker = new CircuitBreaker(callERP, { timeout: 5_000 });
  return breaker.fire(job.data);
});
```

#### BIM Import Basique
- **IFC parser worker** (Node + web-ifc ou IFC.js)
- Extraction : GUID, nom, géométrie simplifiée, propriétés
- **Stocker les métadonnées**, *pas* la géométrie complète (qui sera gérée par viewer IFC à la demande)

**Critères de sortie Intégrations H1** :
- ✅ Synchronisation bi-directionnelle Odoo (assets + WO)
- ✅ Import IFC 1 fichier < 200 MB en moins de 30s
- ✅ Failure modes ERP : pas de crash API, retry visible par l'utilisateur

---

### Livrables Finaux Horizon 1

| Livrable | KPI Cible |
|----------|-----------|
| Plateforme multi-tenant opérationnelle | 3-5 clients pilotes |
| Dashboard ESG auditable | 1 export CSRD validé cabinet |
| Connecteurs ERP essentiels | Odoo + SAP fonctionnel |
| Import IFC basique | Démo en 30s |
| First Positive Cashflow | Avant M12 |

---

## 🔵 Horizon 2 — Différenciation (12-24 mois)

**Objectif** : faire de BeeCarbonat *la* référence terrain + BIM + ESG.

### Thème 2.1 — Mode Offline Robuste (M13-M18)

#### Architecture Cible PWA

```
Service Worker (Workbox)
├── Cache Strategy
│   ├── HTML/CSS/JS : CacheFirst (versionné)
│   ├── API GET : NetworkFirst + fallback cache
│   └── API POST : BackgroundSync queue
├── IndexedDB (Dexie.js)
│   ├── pending_actions (outbox)
│   ├── cached_assets (read-only)
│   └── drafts (autosave)
└── Push Notifications (Firebase Messaging)
```

#### Capacités Offline
- ✅ Consultation assets + WO assignées
- ✅ Création WO avec photo + GPS + signature
- ✅ Synchronisation auto au retour réseau + gestion conflits (last-write-wins ou merge manuel)

**Critères de sortie** :
- ✅ Sous-sol parking, 0 connectivité : technicien crée WO complète
- ✅ Reconnexion : sync transparente, conflits < 1% signalés

---

### Thème 2.2 — BIM Ops (M15-M22)

#### Vision Cible
Passer du *"viewer IFC passif"* au *"BIM comme source de vérité terrain"*.

#### Fonctionnalités
- **Annotations persistantes** : liées à un asset IFC, modifiables dans le temps
- **Vue 2D/3D liée** : clic sur plan → asset dans 3D
- **Work Orders spatiales** : placement géométrique des interventions
- **Historique 4D** : évolution de l'asset dans le temps (état initial → rénové)

```tsx
// Hook unifié : BIM ↔ Asset ↔ WO
function useAssetFromBIM(ifcGuid: string) {
  return useQuery({
    queryKey: ['bim-asset', ifcGuid],
    queryFn: () => api.get(`/bim/assets/${ifcGuid}`),
    staleTime: 5 * 60_000
  });
}
```

**Critères de sortie** :
- ✅ Annotation terrain visible 6 mois après création
- ✅ Viewer IFC < 3s cold start (lazy + cache IndexedDB)
- ✅ Liens IFC ↔ Asset bidirectionnels

---

### Thème 2.3 — API Publique (M18-M22)

#### OpenAPI 3.1
- Génération automatique depuis schémas Zod (route → schemas)
- Documentation interactive (Scalar ou Redoc)
- Versioning : `/v1/`, dépréciation annoncée 6 mois à l'avance
- Webhooks : émetteurs (WO created, asset updated)

#### Politique d'Accès
| Tier | Limite | Authentification |
|------|--------|------------------|
| Public read | 60 req/min | API key |
| Public write | 600 req/min | OAuth2 client_credentials |
| Partner | Illimité + webhooks | Mutualisé |

**Critères de sortie** :
- ✅ 3 intégrations tierces construites par des partenaires externes
- ✅ SDK TypeScript et Python publiés

---

### Livrables Finaux Horizon 2

| Livrable | KPI Cible |
|----------|-----------|
| PWA offline-first | 80% des flux terrain offline |
| BIM Ops avec annotations | 50+ annotations persistantes en prod |
| API publique v1 | 100k appels/jour, latency p95 < 300ms |
| ESG Dashboard enrichi | Scope 1/2/3 (cat 13) complet |
| ARR | 500k€-1M€ |

---

## 🟣 Horizon 3 — Leadership (24-36 mois)

**Objectif** : passer du produit aux données à l'**intelligence opérative**.

### Thème 3.1 — IA Générative Opérationnelle (M25-M32)

#### Assistant Facility Manager
- **Résumé de WO** : condense les commentaires, photos, historique d'asset en bullet points
- **Suggestions d'actions** : basé sur historique + RAG sur documentation technique
- **Diagnostic préliminaire** : "votre pompe fait ce bruit, probables causes : cavitation, désamorçage, usure"

#### Stack Technique
- **LLM** : modèles open-source en self-hosted (Mistral, Llama) pour conformité RGPD, OU API anthropic/openai avec contrat DPA
- **RAG** : pgvector + embeddings sur la documentation technique + WO historiques
- **Guardrails** : sortie IA *toujours* accompagnée de "selon nos données internes, à valider par un expert"

```ts
// Architecture RAG cible
const ragPipeline = async (query: string, tenantId: string) => {
  const embedding = await embed(query);
  const docs = await pgvector.query(`
    SELECT content FROM asset_docs
    WHERE tenant_id = $1
    ORDER BY embedding <-> $2
    LIMIT 10
  `, [tenantId, embedding]);
  
  return llm.complete({
    prompt: buildPrompt(query, docs),
    temperature: 0.3,  // conservateur
    max_tokens: 500
  });
};
```

#### Acquisition de Données IoT
- Connecteurs protocoles : **MQTT** (capteurs modernes), **BACnet** (GTB), **LoRaWAN** (capteurs longue portée)
- Ingestion temps réel → Kafka ou Redpanda
- Corrélation : capteur → asset → tendance → alerte

---

### Thème 3.2 — Marketplace (M28-M36)

#### Modèle Cible
- **Catégories** : Connecteurs ERP, Capteurs IoT, GED, Outils BI, Templates sectoriels
- **Listing public** : pages Web avec notation + avis
- **Revenus** : 70% développeur / 30% plateforme (aligné Stripe/Shopify modèle)
- **Validation technique** : sandbox obligatoire, tests automatisés, signature cryptographique

#### V1 Marketplace
- 5 connecteurs ERP (Sage, Dynamics, Oracle, etc.)
- 3 connecteurs IoT (EnOcean, Carlo Gavazzi, Schneider)
- 1 GED (SharePoint, Google Drive)

---

### Thème 3.3 — Jumeau Numérique Opérationnel (M30-M36)

#### Vision
> "Le BIM n'est plus un livrable de chantier : c'est l'interface quotidienne des opérations."

#### Capacités
- **Navigation 3D temps réel** : données capteurs affichées en surcouche
- **Scénarios what-if** : simulation de rénovation avec impact ESG projeté
- **Multi-échelle** : portefeuille global → site → bâtiment → local → équipement dans une même vue

**Critères de sortie** :
- ✅ Assistant IA réduit le temps moyen de rédaction WO de 40%
- ✅ 10+ connecteurs marketplace actifs
- ✅ Jumeau numérique avec données live sur 3 sites pilotes

---

### Livrables Finaux Horizon 3

| Livrable | KPI Cible |
|----------|-----------|
| Assistant IA en production | 60% des FMs l'utilisent quotidiennement |
| Marketplace v1 | 20+ extensions tierces |
| Jumeau numérique | 3+ sites en live |
| ARR | 3-5M€ |

---

## 🟠 Horizon 4 — Plateforme (36+ mois)

**Objectif** : devenir **l'infrastructure de référence** sur laquelle les Facility Managers construisent leur propre organisation.

### Thème 4.1 — Workflow Engine No-Code (M37-M48)

#### Capacités
- **Déclencheurs** : événement (WO créée, échéance, seuil ESG)
- **Conditions** : logique booléenne sur attributs métier
- **Actions** : notifications, création tâche, appel API, mise à jour statut
- **UI de configuration** : drag-and-drop visuel, test intégré, versionning

#### Sécurité & Gouvernance
- Sandbox d'exécution
- Limitation de taux configurable par workflow
- Audit trail complet

---

### Thème 4.2 — Référentiels Sectoriels (M40-M54)

#### Templates Packagés
| Vertical | Adaptation |
|----------|-----------|
| **Retail** | Turn-over magasinier, contrats enseigne, audits qualité |
| **Santé** | Habilitations personnel, stérilisation équipements, conformité ARS |
| **Éducation** | Calendrier scolaire, sécurité incendie ERP, accessibilité |
| **Industrie** | ATEX, criticité maintenance, gestion arrêts programmés |
| **Public** | Marchés publics (DCE), accessibilité PMR, performance énergétique |

#### Modèle Commercial
- Template *core* : inclus dans l'abonnement
- Template *premium* : 5-20k€ + setup optionnel
- Partenariat avec cabinets experts sectoriels (co-marketing)

---

### Thème 4.3 — Multi-Mondial & Conformité Globale (M48+)

- Certifications : **SOC 2 Type II**, **ISO 27001**, **HIPAA** (si expansion santé US)
- Hébergement régional : EU / UK / US / APAC
- Multi-langue : EN, FR, DE, ES, IT, NL minimum
- Multi-devise : EUR / USD / GBP

---

### Livrables Finaux Horizon 4

| Livrable | KPI Cible |
|----------|-----------|
| Workflow engine no-code | 100+ workflows custom en prod client |
| 5+ référentiels sectoriels | 30%+ clients sur vertical packagée |
| Conformité globale | SOC 2 + ISO 27001 + multi-régions |
| ARR | 10-20M€ |

---

## 🔄 Gestion des Arbitrages Inter-Horizons

| Question d'Arbitrage | Horizon | Décision |
|----------------------|---------|----------|
| Quand lancer le SaaS vs on-prem ? | H1 | SaaS-only jusqu'à demande enterprise |
| Quand i18n ? | H2 | FR/EN dès H1 (clients pilotes internationaux possibles) |
| Quand mobile natif ? | H3 | PWA H2, natif seulement si demande forte (terrain ultra-spécifique) |
| Quand vendre en propre vs via partenaires ? | H2 | Vente directe H1-H2, indirecte H3+ (réseau ESN/intégrateurs) |
| Quand devenir multi-régions ? | H4 | Restreindre EU H1-H3 |

---

## 📊 Tableau de Bord Stratégique (Metriques Globales)

| Métrique | H1 | H2 | H3 | H4 |
|----------|----|----|----|----|
| **ARR** | 100k | 1M | 3-5M | 10-20M |
| **Clients actifs** | 3-5 | 30-50 | 200-400 | 1000+ |
| **NPS** | > 30 | > 40 | > 50 | > 55 |
| **Churn annuel** | < 15% | < 8% | < 6% | < 5% |
| **Time-to-value** | 30j | 14j | 7j | 3j |
| **% ARPU ESG** | 10% | 25% | 40% | 35% (plateforme) |
| **Partners / intégrateurs** | 0 | 5 | 30 | 100+ |
| **Headcount** | 5-10 | 25-40 | 80-120 | 200-300 |

---

## ⚠️ Points de Vigilance par Horizon

### Horizon 1
- 🔴 **SSE** : *L'université de l'erreur* en construction de plateforme multi-tenant. Budget 30% du temps en dette technique préventive.
- 🔴 **ACV** : vente complexe exige des profiles commerciaux *seniors* tôt, pas un growth marketer junior.

### Horizon 2
- 🟡 **Choix stack offline** : Workbox vs Baklava (Notion) vs PWA-only — chaque option a des trade-offs UX. Valider sur POC.
- 🟡 **API publique = contrat juridique** : un breaking change = une colère client. Engagement formel de rétrocompatibilité.

### Horizon 3
- 🟡 **IA Générative = risque réputationnel** : une mauvaise réponse sur la sécurité d'un bâtiment = procès. Sandbox + humain dans la boucle obligatoires.
- 🟡 **Marketplace** : le grand cimetière des marketplaces SaaS. Assurer *vous-même* l'intégration des 5 premières avant ouverture.

### Horizon 4
- 🟡 **No-code** : la complexité d'un moteur de workflow scale-up est *vaste*. Engager un architecte dédié.
- 🟡 **Multi-mondial** : les certifications coûtent cher et prennent du temps. Planifier 18 mois avant.

---

## 🚀 Prochaines Actions Immédiates (30 jours)

1. **Valider la promesse différenciatrice** : atelier produit avec 5 prospects cibles, test du pitch ESG-first.
2. **Identifier 1 ICP précis** : nommer 1 vertical d'attaque (recommandation : *foncière tertiaire 50-500 sites en EU francophone*).
3. **POC demonstrable** : 1 site pilote avec dashboard ESG basique, prêt en 6 semaines.
4. **Carte des premiers intégrateurs** : lister 5 intégrateurs BIM/FM européens (typiquement 10-50 personnes) susceptibles de pousser BeeCarbonat en white-label.
5. **Recruter 1 Head of Sales** avec réseau dans l'immobilier d'entreprise (pas un SaaS generic).
6. **Cadrage juridique** : DPA modèles, contrat API publique draft, conditions marketplace anticipées.
