FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

# Build the frontend assets (Vite)
RUN npm run build

# Expose the API and WebSocket port
EXPOSE 3000

# Start the server using tsx in production-like manner or compilation
CMD ["npx", "tsx", "server.ts"]
