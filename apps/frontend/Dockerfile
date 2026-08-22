# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/frontend/package.json ./apps/frontend/
RUN npm install
COPY apps/frontend/ ./apps/frontend/
WORKDIR /app/apps/frontend
RUN npm run build

# Étape 2 : Nginx pour servir le SPA
FROM nginx:alpine
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
