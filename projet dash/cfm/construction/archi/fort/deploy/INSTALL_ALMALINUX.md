# 🚀 Installation ReclamTrack sur AlmaLinux (Serveur Linux)

> **Durée estimée** : 10–20 minutes selon la connexion internet

---

## ✅ Prérequis Serveur

| Composant | Minimum                                                   |
| --------- | --------------------------------------------------------- |
| OS        | AlmaLinux 8.x ou 9.x (Rocky Linux supporté aussi)         |
| RAM       | 4 Go minimum (8 Go recommandé)                            |
| Disque    | 20 Go libres                                              |
| CPU       | 2 vCPU minimum                                            |
| Réseau    | Accès internet (pour télécharger Docker, Node.js, images) |
| Droits    | Accès `root` ou `sudo`                                    |

---

## 📋 Installation en 1 commande

### Étape 1 — Connectez-vous à votre serveur AlmaLinux

```bash
ssh root@VOTRE_IP_SERVEUR
```

### Étape 2 — Clonez le dépôt

```bash
git clone https://github.com/terix85/reclamtrack.git /opt/reclamtrack
cd /opt/reclamtrack
```

### Étape 3 — Lancez le script d'installation

```bash
sudo bash deploy/install.sh
```

> **Le script fait tout automatiquement :**
>
> 1. Met à jour AlmaLinux (`dnf update`)
> 2. Installe Node.js 20
> 3. Installe Docker & Docker Compose
> 4. Crée l'utilisateur système `reclamtrack`
> 5. Clone/met à jour le code
> 6. Génère les fichiers `.env` avec des secrets sécurisés
> 7. Build et lance tous les conteneurs
> 8. Crée un service `systemd` (démarrage automatique)
> 9. Ouvre les ports nécessaires dans le firewall

---

## 🌐 Accès à l'application (après installation)

Remplacez `VOTRE_IP` par l'adresse IP publique de votre serveur :

| Service                  | URL                             | Identifiants par défaut           |
| ------------------------ | ------------------------------- | --------------------------------- |
| **Frontend**             | `http://VOTRE_IP:3000`          | Créez un compte lors du 1er accès |
| **API Backend**          | `http://VOTRE_IP:5001`          | —                                 |
| **API Docs (Swagger)**   | `http://VOTRE_IP:5001/api-docs` | —                                 |
| **Grafana (monitoring)** | `http://VOTRE_IP:3001`          | `admin` / `reclamtrack2024`       |
| **Prometheus**           | `http://VOTRE_IP:9090`          | —                                 |
| **Kafka UI**             | `http://VOTRE_IP:8080`          | —                                 |

---

## ⚙️ Configuration (Variables d'environnement)

Après l'installation, éditez `/opt/reclamtrack/.env` pour adapter à votre environnement :

```bash
nano /opt/reclamtrack/.env
```

Variables importantes à changer en production :

```env
# ─── Obligatoire ─────────────────────────────────────────
JWT_SECRET=CHANGEZ_CETTE_VALEUR_LONGUE_ET_SECRETE
NEXTAUTH_SECRET=AUSSI_UNE_VALEUR_ALEATOIRE_LONGUE

# ─── Optionnel : Google OAuth ─────────────────────────────
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret

# ─── URL publique si derrière un reverse proxy ────────────
NEXT_PUBLIC_API_URL=https://api.votredomaine.com
NEXTAUTH_URL=https://votredomaine.com
```

Après modification, redémarrez :

```bash
cd /opt/reclamtrack && docker compose down && docker compose up -d
```

---

## 🛠️ Commandes de gestion courantes

```bash
# Voir l'état de tous les services
cd /opt/reclamtrack
docker compose ps

# Voir les logs en direct de tous les services
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f backend
docker compose logs -f frontend

# Redémarrer un service
docker compose restart backend

# Arrêter l'application
docker compose down

# Démarrer l'application
docker compose up -d

# Mettre à jour l'application (pull + rebuild)
sudo bash /opt/reclamtrack/deploy/update.sh
```

---

## 🔄 Mise à jour de l'application

```bash
sudo bash /opt/reclamtrack/deploy/update.sh
```

---

## 🔒 Sécuriser avec HTTPS (Recommandé en production)

### Option A — Nginx + Certbot (Let's Encrypt)

```bash
dnf install -y nginx certbot python3-certbot-nginx

# Configurer nginx comme reverse proxy
cat > /etc/nginx/conf.d/reclamtrack.conf <<'EOF'
server {
    listen 80;
    server_name votredomaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

systemctl enable --now nginx

# Obtenir le certificat SSL
certbot --nginx -d votredomaine.com
```

---

## 🐛 Dépannage

### Les conteneurs ne démarrent pas

```bash
cd /opt/reclamtrack
docker compose logs
```

### Port déjà utilisé

```bash
ss -tlnp | grep 3000
# Trouvez et arrêtez le processus conflictuel
```

### Erreur MongoDB

```bash
docker compose logs mongo
# Vérifiez l'espace disque
df -h
```

### Réinstallation complète

```bash
cd /opt/reclamtrack
docker compose down -v   # Supprime aussi les volumes (⚠️ perte de données)
sudo bash deploy/install.sh
```

---

## 📞 Support

- **GitHub** : https://github.com/terix85/reclamtrack
- **Issues** : https://github.com/terix85/reclamtrack/issues
