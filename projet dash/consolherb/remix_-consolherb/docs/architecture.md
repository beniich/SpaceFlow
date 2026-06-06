# AgroMaître Architecture

## Frontend
The frontend is a React Single Page Application (SPA) built with Vite, TypeScript, and Tailwind CSS v4.
- **Routing**: `react-router-dom` is used for client-side routing.
- **State Management**: `zustand` provides global state (e.g., Audit Logs, Node statuses).
- **Styling**: Tailwind CSS v4 (inline configuration via `@theme` in `src/index.css`).
- **Icons**: `lucide-react` for SVG icons.
- **Animations**: `motion/react` for complex UI transitions.

### Key Directories
- `src/pages/`: Core application views (Dashboard, Infra, Logs, etc.)
- `src/components/`: Reusable UI elements and complex widgets.
- `src/api/`: API wrapper and Firebase auth integration.
- `src/store/`: Zustand state definitions.
- `src/routes/`: Route definitions.

## Backend
The backend is an Express.js server providing RESTful APIs.
- **Language**: TypeScript
- **Database ORM**: Prisma (PostgreSQL)
- **Authentication**: Firebase Admin SDK (JWT Validation)

### Key Directories
- `server/src/controllers/`: Request handlers mapping to specific domains (auth, sensors, reports).
- `server/src/routes/`: Express route definitions.
- `server/src/middlewares/`: Express middlewares including `authMiddleware` for protecting routes.
- `server/prisma/`: Prisma schema defining PostgreSQL models.

## Infrastructure / Deployment
The application uses a multi-container Docker setup defined in `docker-compose.yml`.
- `db`: PostgreSQL 15 container.
- `backend`: Node.js Express server running on port 4000.
- `frontend`: Nginx server hosting the built React static files on port 80 (mapped to 3000 locally).

CI/CD is automated via GitHub Actions (`.github/workflows/main.yml`), which lints, tests, and builds both the frontend and backend Docker images on every push to the main branch.
