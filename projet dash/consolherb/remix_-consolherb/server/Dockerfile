# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Builder
# Compiles TypeScript to JavaScript
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first for better layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies needed for tsc)
RUN npm ci

# Copy source files and Prisma schema
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY src ./src/

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript
RUN npx tsc --project tsconfig.json

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Runner
# Lean production image — only compiled JS + production node_modules
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

# Copy manifests
COPY package.json package-lock.json* ./

# Install production-only dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Copy generated Prisma client (required at runtime)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Prisma schema is needed for migrations
COPY prisma ./prisma/

EXPOSE 4000

CMD ["node", "dist/index.js"]
