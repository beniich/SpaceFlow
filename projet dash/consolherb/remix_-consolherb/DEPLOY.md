# AgroMaître — Deployment Guide

> **Stack:** React/Vite · Express/Prisma · PostgreSQL 16 · Nginx · Traefik v3 · GitHub Actions
> **Domains:** `https://app.agromaitre.io` (frontend) · `https://api.agromaitre.io` (backend)

---

## Architecture Overview

```
Internet
   │
   ▼
Traefik (443/80) ── Let's Encrypt TLS
   │
   ├── app.agromaitre.io  ──► frontend (Nginx:80) ──► /usr/share/nginx/html (React SPA)
   │                                                   │
   │                                        /api/*  ──► backend:4000
   │
   └── api.agromaitre.io  ──► backend (Node:4000)
                                      │
                                      └── db (Postgres:5432)
```

All services share the `agromaitre-net` Docker bridge network. Only Traefik binds to host ports 80/443.

---

## Step 1 — VPS Setup (Ubuntu 22.04)

### 1.1 Connect to your VPS
```bash
ssh root@<YOUR_VPS_IP>
```

### 1.2 Create a non-root deploy user
```bash
adduser deploy
usermod -aG sudo deploy
# Copy your SSH public key
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys
```

### 1.3 Install Docker & Docker Compose Plugin
```bash
# Add Docker's official GPG key
apt-get update && apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add the repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install
apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# Allow deploy user to use Docker without sudo
usermod -aG docker deploy
```

### 1.4 Create the deployment directory
```bash
mkdir -p /opt/agromaitre
chown deploy:deploy /opt/agromaitre
```

### 1.5 Upload docker-compose.prod.yml to VPS
```bash
# From your local machine:
scp docker-compose.prod.yml deploy@<YOUR_VPS_IP>:/opt/agromaitre/
```

---

## Step 2 — DNS Configuration

Log in to your DNS provider and create **two A records**:

| Hostname              | Type | Value          | TTL  |
|-----------------------|------|----------------|------|
| `app.agromaitre.io`   | A    | `<VPS_IP>`     | 300  |
| `api.agromaitre.io`   | A    | `<VPS_IP>`     | 300  |

> **Wait for propagation** before deploying — Traefik needs DNS to resolve for Let's Encrypt to issue certificates.
> Check with: `dig app.agromaitre.io +short`

---

## Step 3 — GitHub Secrets Setup

Go to your repository → **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

| Secret Name             | Value                                          |
|-------------------------|------------------------------------------------|
| `VPS_HOST`              | Your VPS IP address or hostname                |
| `VPS_USER`              | `deploy` (or your SSH username)                |
| `VPS_SSH_KEY`           | Contents of your **private** SSH key (`~/.ssh/id_rsa`) |
| `VPS_PORT`              | `22` (or your custom SSH port)                 |
| `DB_PASSWORD`           | Strong random password (see below)             |
| `ACME_EMAIL`            | Your email for Let's Encrypt notifications     |
| `FIREBASE_PROJECT_ID`   | From Firebase Console → Project Settings       |
| `FIREBASE_PRIVATE_KEY`  | The full private key including `\n` literals   |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email                 |

**Generate a strong DB password:**
```bash
openssl rand -base64 32
```

**Get your SSH private key:**
```bash
cat ~/.ssh/id_rsa   # Copy the entire output including -----BEGIN/END----- lines
```

---

## Step 4 — First Deployment

### 4.1 Manual first-time setup on VPS
SSH into VPS as `deploy` and run:

```bash
cd /opt/agromaitre

# Create .env from example (fill in values or let GitHub Actions write it)
cp .env.production.example .env
nano .env  # Fill in all <CHANGE_ME> values

# Pull images (first time, requires logging into ghcr.io)
echo "<YOUR_GITHUB_PAT>" | docker login ghcr.io -u <YOUR_GITHUB_USERNAME> --password-stdin

# Start the full stack
docker compose -f docker-compose.prod.yml up -d

# Run initial database migrations
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Check all containers are healthy
docker compose -f docker-compose.prod.yml ps
```

### 4.2 Verify Traefik is issuing certificates
```bash
# Watch Traefik logs for certificate issuance
docker logs agromaitre_traefik --follow

# You should see: "Obtained certificate for domain"
```

### 4.3 Test the deployment
```bash
curl -I https://app.agromaitre.io          # Should return 200 with nginx headers
curl https://api.agromaitre.io/api/health  # Should return {"status":"ok"}
```

---

## Step 5 — Continuous Deployment (Push to Deploy)

After the first deployment, **all future updates are automatic**:

```bash
# On your local machine — just push to main
git add .
git commit -m "feat: your new feature"
git push origin main

# GitHub Actions will:
#   1. Run tests (npm test on frontend + tsc on backend)
#   2. Build Docker images and push to ghcr.io with SHA tag
#   3. SSH into VPS, pull new images, restart containers
#   4. Run prisma migrate deploy automatically
```

Monitor your deployment in the **Actions** tab on GitHub.

---

## Day-2 Operations

### View container logs
```bash
cd /opt/agromaitre

# All services
docker compose -f docker-compose.prod.yml logs --tail=100 -f

# Specific service
docker compose -f docker-compose.prod.yml logs backend --tail=100 -f
docker compose -f docker-compose.prod.yml logs traefik --tail=50
```

### Restart a specific service
```bash
docker compose -f docker-compose.prod.yml restart backend
```

### Manual rollback to a specific SHA
```bash
# Find image SHAs in GitHub Packages or Actions logs
IMAGE_TAG=sha-abc1234 docker compose -f docker-compose.prod.yml up -d backend
```

### Database backup
```bash
docker exec agromaitre_db pg_dump -U agromaitre agromaitre | \
  gzip > /opt/backups/agromaitre_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Run Prisma Studio (temporary, on VPS)
```bash
# Only while debugging — opens on port 5555
docker compose -f docker-compose.prod.yml exec backend npx prisma studio
# Access via SSH tunnel: ssh -L 5555:localhost:5555 deploy@<VPS_IP>
```

### Update environment variables
```bash
nano /opt/agromaitre/.env
docker compose -f docker-compose.prod.yml up -d  # Picks up new env without rebuild
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `502 Bad Gateway` | Backend container is not running. Check `docker compose ps` and `logs backend` |
| SSL certificate not issued | DNS not propagated yet, or port 80 blocked by firewall. Run `docker logs agromaitre_traefik` |
| Database connection refused | DB health check failing. Run `docker compose ps db` — wait for `healthy` |
| Images not pulling on VPS | GHCR login expired. Re-run `docker login ghcr.io` with a new PAT |
| Frontend shows blank page | Check browser console for JS errors. Verify `VITE_API_URL` was set at build time |

---

## File Reference

| File | Purpose |
|------|---------|
| `docker-compose.prod.yml` | Full production stack definition |
| `Dockerfile.frontend` | Multi-stage build for the React/Nginx image |
| `nginx.conf` | SPA routing, API proxy, caching, gzip |
| `.github/workflows/deploy.yml` | CI/CD pipeline (test → build → deploy) |
| `.env.production.example` | Template for all required environment variables |
