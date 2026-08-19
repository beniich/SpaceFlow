# Debug‑Assistant IA (Claude)

**Objectif** – Fournir un moteur de capture d'erreurs, d'analyse assistée par Anthropic Claude, et un widget de console flottante pour les développeurs.

## 📦 Stack technologique

| Layer      | Tech                |
|------------|--------------------|
| Backend    | FastAPI, Poetry, Python 3.12 |
| Frontend   | Vite + React (TS) |
| IA Wrapper | Anthropic SDK (Claude) |
| Orchestration | Docker‑Compose |
| CI/CD      | GitHub Actions (lint + tests) |
| Logging    | structlog → JSON |

## 🚀 Démarrage rapide (dev)

```bash
# 1️⃣  Backend
cd backend
poetry install
poetry run uvicorn app.main:app --reload   # http://localhost:8000/ping

# 2️⃣  Frontend
cd ../frontend
npm ci
npm run dev                               # http://localhost:5173

# 3️⃣  Ou via Docker (tout en une commande)
cd ..
docker compose up --build
```

## 📚 Environnement

Copiez le fichier d'exemple :

```bash
cp .env.example .env
# éditez .env et renseignez votre clé ANTHROPIC_API_KEY
```

> **IMPORTANT**: Obtenez votre clé API gratuite sur https://console.anthropic.com/

## 🧪 Tests

```bash
# Backend
cd backend
poetry run pytest

# Frontend
cd ../frontend
npm run test
```

## 🔧 CI

- Le workflow GitHub Actions **ci-debug-assistant.yml** s'exécute sur chaque push/PR.  
- Il vérifie : `ruff` (lint), `pytest` (coverage), build Vite.

## Widget de débogage

- **Raccourci**: `Ctrl + Alt + D` pour afficher/masquer
- **Activation**: Uniquement en mode développement (`DEBUG_WIDGET_ENABLED=true`)
- **Fonctionnalités**:
  - Analyse IA des erreurs en temps réel
  - Suggestions de correctifs (patches)
  - Métriques de consommation de tokens

## 📖 Road‑map

### Phase 1 (Bootstrapping) ✅
- Backend FastAPI skeleton
- Frontend React + Vite
- Docker infrastructure
- CI/CD pipeline

### Phase 2 (En cours)
- **AI-002**: Middleware de capture d'erreurs
- **AI-003**: Modèle de persistance (PostgreSQL) 
- **AI-004**: Router `/debug/*`
- **AI-005**: Service de génération de patches
- **AI-006**: Dashboard d'analytics
- **AI-007**: Console flottante améliorée

## 🔐 Sécurité

- Clé API Anthropic stockée dans `.env` (jamais commise)
- Widget désactivé automatiquement en production
- Logs structurés sans données sensibles
- PII filtré avant envoi à l'IA

## 📄 License

MIT
