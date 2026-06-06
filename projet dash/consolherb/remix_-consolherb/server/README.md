# AgroMaître — Backend API

Express + Prisma + Firebase-Admin REST API for the AgroMaître SaaS/ERP platform.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| npm | ≥ 10 |
| PostgreSQL | ≥ 14 |
| Firebase project | with a service account |

---

## 1 — Setup

```bash
# Inside the server/ directory
cd server

# Copy the example env file and fill in your values
cp .env.example .env
```

Edit `.env` and set:

- `DATABASE_URL` — your PostgreSQL connection string  
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` — from your Firebase service account JSON  
- `JWT_SECRET` — any long random string  
- `PORT` — default `4000`  
- `CORS_ORIGIN` — the frontend URL (default `http://localhost:3001`)

---

## 2 — Install dependencies

```bash
npm install
```

---

## 3 — Database setup

```bash
# Run migrations (creates tables from prisma/schema.prisma)
npx prisma migrate dev --name init

# Optional: open Prisma Studio in your browser
npx prisma studio
```

---

## 4 — Development

```bash
npm run dev
```

Hot-reloads on file changes via `ts-node-dev`.  
Server starts at: **http://localhost:4000**

---

## 5 — Production build

```bash
npm run build   # Compiles TypeScript → dist/
npm start       # Runs dist/index.js
```

---

## 6 — Docker

```bash
# Build the image (from inside server/)
docker build -t agromaitre-api .

# Run the container
docker run \
  --env-file .env \
  -p 4000:4000 \
  agromaitre-api
```

> **Note:** Make sure your PostgreSQL instance is reachable from inside the container.  
> For local dev, use `host.docker.internal` instead of `localhost` in `DATABASE_URL`.

---

## 7 — API Endpoints

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | ❌ | Server health check |

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/auth/me` | ✅ | Get / create your profile |
| GET | `/api/auth/users` | ✅ Admin | List all users |

### Sensors — `/api/sensors`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/sensors` | ✅ | List all sensors |
| POST | `/api/sensors` | ✅ | Create a sensor `{ name, type, zoneId }` |
| GET | `/api/sensors/:id` | ✅ | Get sensor + recent logs |
| GET | `/api/sensors/:id/logs` | ✅ | Last 50 sensor logs |
| POST | `/api/sensors/:id/logs` | ✅ | Append log entry `{ value, unit }` |

### Reports — `/api/reports`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/reports` | ✅ | List all reports |
| POST | `/api/reports` | ✅ | Create report `{ title, type, content }` |
| GET | `/api/reports/:id` | ✅ | Get single report |
| DELETE | `/api/reports/:id` | ✅ Admin | Delete a report |

---

### Authentication

All protected endpoints require a Firebase ID token in the `Authorization` header:

```
Authorization: Bearer <firebase_id_token>
```

Obtain the token from the Firebase JS SDK on the frontend with `getIdToken()`.

---

## Project structure

```
server/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── controllers/        # Route handler logic
│   │   ├── authController.ts
│   │   ├── sensorController.ts
│   │   └── reportController.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts   # Firebase token verification
│   │   └── errorHandler.ts    # Global error handler
│   ├── routes/
│   │   ├── apiRouter.ts        # Central router
│   │   ├── authRoutes.ts
│   │   ├── sensorRoutes.ts
│   │   └── reportRoutes.ts
│   ├── utils/
│   │   ├── prisma.ts           # Singleton Prisma client
│   │   └── firebaseAdmin.ts    # Firebase Admin SDK init
│   └── index.ts                # Express app + server start
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── Dockerfile
├── package.json
└── tsconfig.json
```
