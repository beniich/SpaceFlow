#!/bin/bash
# Script de déploiement en production pour AgroMaître
# À exécuter sur le serveur VPS (Ubuntu/Debian)

set -e

echo "🚀 Préparation du serveur pour le déploiement d'AgroMaître..."

# 1. Mise à jour et installation des prérequis
echo "📦 Mise à jour du système et installation de Docker..."
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose curl git

# 2. Démarrage de Docker
sudo systemctl enable docker
sudo systemctl start docker

# 3. Création du fichier .env de production s'il n'existe pas
if [ ! -f .env.prod ]; then
  echo "🔑 Création du fichier de configuration .env.prod..."
  cat <<EOF > .env.prod
DOMAIN=agromaitre.votre-domaine.com
ACME_EMAIL=admin@votre-domaine.com
DB_USER=agromaitre_admin
DB_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 24 | head -n 1)
FIREBASE_PROJECT_ID=votre-projet-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@votre-projet.iam.gserviceaccount.com
EOF
  echo "⚠️ VEUILLEZ ÉDITER .env.prod AVEC VOS INFORMATIONS (DOMAINE, FIREBASE, ETC.) PUIS RELANCER CE SCRIPT."
  exit 1
fi

# 4. Lancement avec Docker Compose
echo "🐳 Lancement des conteneurs en production..."
sudo docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# 5. Migration de la base de données
echo "🗄️ Application des migrations de base de données..."
sudo docker exec -it agromaitre_backend_prod npx prisma migrate deploy

echo "✅ DÉPLOIEMENT TERMINÉ !"
echo "🌐 Votre application sera disponible sur https://\$(grep DOMAIN .env.prod | cut -d '=' -f2)"
echo "Attendez quelques minutes pour que Let's Encrypt génère le certificat SSL."
