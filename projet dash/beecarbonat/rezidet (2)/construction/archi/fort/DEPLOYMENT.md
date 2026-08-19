# Guide de Déploiement - ReclamTrack

## 📋 Table des Matières
1. [Prérequis](#prérequis)
2. [Déploiement Backend](#déploiement-backend)
3. [Déploiement Frontend](#déploiement-frontend)
4. [Configuration Production](#configuration-production)
5. [Monitoring et Maintenance](#monitoring-et-maintenance)

## 🔧 Prérequis

### Serveur
- **OS**: Ubuntu 20.04+ ou Windows Server 2019+
- **RAM**: Minimum 2GB (4GB recommandé)
- **CPU**: 2 cores minimum
- **Stockage**: 20GB minimum

### Logiciels Requis
- Node.js 18.x ou supérieur
- MongoDB 6.x ou supérieur
- nginx (pour reverse proxy)
- PM2 (pour la gestion des processus)
- Git

## 🚀 Déploiement Backend

### 1. Installation des dépendances

```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Installer PM2
sudo npm install -g pm2
```

### 2. Cloner et configurer le projet

```bash
# Cloner le repository
git clone https://github.com/votre-org/reclamtrack.git
cd reclamtrack/backend

# Installer les dépendances
npm install --production

# Créer le fichier .env
cp .env.example .env
nano .env
```

### 3. Configuration .env (Production)

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/reclamtrack_prod
JWT_SECRET=VOTRE_SECRET_SUPER_SECURISE_ICI
JWT_EXPIRE=7d
CORS_ORIGIN=https://votre-domaine.com
```

### 4. Démarrer avec PM2

```bash
# Build (si TypeScript)
npm run build

# Démarrer avec PM2
pm2 start dist/server.js --name reclamtrack-api

# Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

## 🌐 Déploiement Frontend

### Option 1: Déploiement sur Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd frontend
vercel --prod
```

### Option 2: Déploiement sur serveur propre

```bash
cd frontend

# Build de production
npm run build

# Démarrer avec PM2
pm2 start npm --name reclamtrack-web -- start

# Sauvegarder
pm2 save
```

### Configuration nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/reclamtrack

# Frontend
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.votre-domaine.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://votre-domaine.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/reclamtrack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtenir les certificats
sudo certbot --nginx -d votre-domaine.com -d api.votre-domaine.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

## ⚙️ Configuration Production

### Variables d'environnement Frontend

Créer `.env.production` :

```env
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api
NEXT_PUBLIC_APP_NAME=ReclamTrack
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_cle_api_google_maps
```

### Optimisations Next.js

Dans `next.config.js` :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Images optimization
  images: {
    domains: ['votre-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## 📊 Monitoring et Maintenance

### Logs avec PM2

```bash
# Voir les logs
pm2 logs reclamtrack-api
pm2 logs reclamtrack-web

# Logs en temps réel
pm2 logs --lines 100

# Sauvegarder les logs
pm2 install pm2-logrotate
```

### Monitoring

```bash
# Dashboard PM2
pm2 monit

# Statistiques
pm2 status
```

### Backup MongoDB

```bash
# Script de backup quotidien
#!/bin/bash
# /usr/local/bin/backup-mongodb.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --db reclamtrack_prod --out $BACKUP_DIR/backup_$DATE

# Garder seulement les 7 derniers backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

```bash
# Ajouter au crontab
sudo crontab -e

# Backup quotidien à 2h du matin
0 2 * * * /usr/local/bin/backup-mongodb.sh
```

### Mise à jour de l'application

```bash
# Script de mise à jour
#!/bin/bash
# update-app.sh

cd /path/to/reclamtrack

# Backend
cd backend
git pull
npm install --production
npm run build
pm2 restart reclamtrack-api

# Frontend
cd ../frontend
git pull
npm install --production
npm run build
pm2 restart reclamtrack-web

echo "Mise à jour terminée!"
```

## 🔒 Sécurité

### Firewall

```bash
# UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### MongoDB Sécurité

```bash
# Créer un utilisateur admin MongoDB
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "mot_de_passe_securise",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

# Activer l'authentification
sudo nano /etc/mongod.conf
```

Ajouter :
```yaml
security:
  authorization: enabled
```

```bash
sudo systemctl restart mongod
```

### Mise à jour du système

```bash
# Mises à jour automatiques
sudo apt-get install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📈 Performance

### Optimisation MongoDB

```javascript
// Créer des index
db.complaints.createIndex({ "status": 1, "createdAt": -1 })
db.complaints.createIndex({ "location": "2dsphere" })
db.teams.createIndex({ "name": 1 })
```

### Cache avec Redis (Optionnel)

```bash
# Installer Redis
sudo apt-get install redis-server
sudo systemctl enable redis-server
```

## 🆘 Dépannage

### Problèmes courants

**Backend ne démarre pas**
```bash
# Vérifier les logs
pm2 logs reclamtrack-api --err

# Vérifier MongoDB
sudo systemctl status mongod
```

**Frontend erreur 502**
```bash
# Vérifier nginx
sudo nginx -t
sudo systemctl status nginx

# Vérifier le processus Next.js
pm2 status
```

**Base de données lente**
```bash
# Analyser les requêtes lentes
mongosh
use reclamtrack_prod
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5)
```

## 📞 Support

Pour toute question sur le déploiement :
- Documentation : https://docs.votre-domaine.com
- Support : support@votre-domaine.com

---

**Dernière mise à jour**: Février 2026
