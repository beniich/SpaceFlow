# Étape 1 : Build du package database partagé
FROM node:20-alpine AS database-builder
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY packages/database/package.json ./packages/database/
COPY packages/database/prisma ./packages/database/prisma
COPY packages/database/tsconfig.json ./packages/database/
COPY packages/database/src ./packages/database/src
RUN npm install --workspaces=false
RUN npm install -w @beecarbonit/database
RUN cd packages/database && npx prisma generate && npx tsc

# Étape 2 : Build de l'image finale
FROM node:20-alpine
WORKDIR /app

# Installer les dépendances racine
COPY package.json package-lock.json* ./
COPY packages/ ./packages/
COPY apps/backend/package.json ./apps/backend/
RUN npm install --workspaces=false

# Générer Prisma dans le contexte final
COPY --from=database-builder /repo/packages/database/node_modules/.prisma ./packages/database/node_modules/.prisma
COPY --from=database-builder /repo/packages/database/dist ./packages/database/dist

# Copier le code backend
COPY apps/backend/ ./apps/backend/

# Build du backend si nécessaire
RUN cd apps/backend && [ -f "tsconfig.json" ] && npx tsc || true

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

WORKDIR /app/apps/backend
CMD ["node", "server.js"]
