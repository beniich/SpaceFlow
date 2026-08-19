# 🚀Roadmap ReclamTrack : Vers WebAssembly (Wasm) 

Ce document trace le chemin pour intégrer **WebAssembly** dans l'architecture ReclamTrack sans compromettre la stabilité actuelle ("so ren casse").

---

## 📅 Phase 0 : Choix Technologique & Environnement

L'objectif est d'utiliser un langage performant qui compile en Wasm pour les parties critiques.

### 1. Sélection du Langage
*   **Option A : Rust (Recommandé)** - Meilleure performance, typage fort, écosystème mature (`wasm-pack`).
*   **Option B : AssemblyScript** - Plus rapide à apprendre (syntaxe TypeScript), idéal pour des calculs simples.

### 2. Configuration Infrastructure
Modifier `frontend/next.config.mjs` pour supporter le chargement asynchrone des fichiers Wasm :
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = { 
      ...config.experiments, 
      asyncWebAssembly: true 
    };
    return config;
  },
  // ... autres configs
};
```

---

## 🛠️ Phase 1 : Preuve de Concept (POC)

Ne migrez pas de gros modules immédiatement. Commencez par un utilitaire isolé.

1.  **Création du module** : Dans `shared/wasm/`.
2.  **Compilation** : Générer le binaire `.wasm` et le "glue code" JS.
3.  **Intégration Frontend** : Importer le module dans un composant Next.js.
    ```typescript
    const wasmModule = await import('@reclamtrack/wasm-core');
    const result = wasmModule.calculate_priority(ticketData);
    ```

---

## ⚡ Phase 2 : Migration de la Logique Critique

Ciblez les modules qui consomment du CPU ou bloquent le thread principal.

| Module Cible | Bénéfice Wasm |
|--------------|--------------|
| **AuditGuard Engine** | Analyse ultra-rapide des logs d'audit volumineux. |
| **RosterFlow Optimization** | Algorithmes de planification sous contraintes. |
| **Search Engine** | Filtrage multicritères instantané sur >10k tickets. |
| **Data Export** | Génération de rapports Excel/PDF complexes côté client. |

---

## 🔄 Phase 3 : Logique Universelle Partagée

Le but ultime est d'avoir un "Core" unique tournant partout.

*   **Shared Core** : Écrire la logique de validation et de calcul une seule fois en Rust.
*   **Backend (Node.js)** : Charger le binaire Wasm pour les routes API critiques.
*   **Frontend (Next.js)** : Utiliser le même binaire dans le navigateur.
*   **Sync** : Zéro divergence entre les règles métier du serveur et celles de l'interface graphique.

---

## 🛡️ Phase 4 : Sécurité & Isolation

Utiliser WebAssembly comme une "Sandbox" pour :
*   Exécuter des plugins tiers en toute sécurité.
*   Isoler les calculs sensibles (chiffrement, validation de signatures).
*   Protéger la propriété intellectuelle (IP) des algorithmes métier.

---

## 📝 Notes pour les Développeurs
*   **Règle d'or** : N'utilisez Wasm que si le gain de performance ou de sécurité est réel. Pour du simple CRUD, restez en TypeScript.
*   **Outils clés** : `wasm-pack` (Rust), `asc` (AssemblyScript), `serde-wasm-bindgen` (pour l'échange de données JSON complexes).

---

> **Statut actuel** : En cours de planification.  
> **Auteur** : IA Antigravity (Assistant ReclamTrack)  
