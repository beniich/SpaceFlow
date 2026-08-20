FROM node:20-alpine AS builder

WORKDIR /app

# Copie des configurations
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/

# Installation des dépendances Backend
WORKDIR /app/apps/backend
RUN npm ci

# Génération des clients Prisma
COPY apps/backend/prisma ./prisma
RUN npx prisma generate

# Copie du code source backend
COPY apps/backend ./

# Étape finale (Production)
FROM node:20-alpine AS runner

WORKDIR /app/apps/backend

ENV NODE_ENV production
ENV BACKEND_PORT 8081

# Copie depuis le builder
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./package.json
COPY --from=builder /app/apps/backend/src ./src
COPY --from=builder /app/apps/backend/prisma ./prisma

EXPOSE 8081

CMD ["npm", "start"]
