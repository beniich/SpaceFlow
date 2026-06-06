# AgroMaître SaaS/ERP

AgroMaître is a professional SaaS ERP application designed for smart agriculture management, cyber-compliance tracking, and infrastructure monitoring.

## Features
- **Frontend**: React + Vite + TypeScript + Tailwind CSS v4 + Zustand + React Router
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Database**: PostgreSQL
- **Auth**: Firebase Authentication + Firebase Admin SDK
- **Testing**: Vitest + Playwright
- **DevOps**: Docker, Nginx, GitHub Actions CI/CD

## Quick Start

### 1. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your PostgreSQL and Firebase credentials
npm install
npx prisma migrate dev --name init
npm run dev
```

### 2. Frontend Setup
```bash
# From the root directory
npm install
npm run dev
```

### 3. Docker Compose
To run the entire stack (Database, Backend, Frontend) via Docker:
```bash
docker-compose up --build
```
The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:4000`.

## Documentation
- [Architecture & Overview](./docs/architecture.md)
