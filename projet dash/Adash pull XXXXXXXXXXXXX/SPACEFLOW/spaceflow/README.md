# SpaceFlow

> Plateforme de gestion pour espaces de coworking

## 🚀 Quickstart

```bash
# 1. Backend
cd apps/backend
cp .env.example .env
docker compose up -d postgres redis
npx prisma migrate dev
npx ts-node prisma/seed-demo.ts
npm run dev

# 2. Frontend (autre terminal)
cd apps/web
npm install
npm run dev
```

Ouvrir http://localhost:5173

**Compte démo** : `demo@spaceflow.com` / `demo123!`

## 📚 Documentation

- [API Reference](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Pricing](docs/PRICING.md)
