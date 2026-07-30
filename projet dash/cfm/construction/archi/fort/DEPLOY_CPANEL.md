# 🚀 Guide de Déploiement sur cPanel (Node.js)

Ce guide explique comment déployer l'application ReclamTrack (Frontend Next.js + Backend Express) sur un hébergement cPanel standard supportant Node.js.

## 📋 Prérequis

1.  **Accès cPanel** avec support "Setup Node.js App" (souvent via CloudLinux/Phusion Passenger).
2.  **Base de données** :
    *   Le Backend requiert **MongoDB**.
    *   Le serveur cPanel propose PostgreSQL/MySQL.
    *   **Solution recommandée** : Utiliser un cluster gratuit **MongoDB Atlas** (externe) pour la base de données.
3.  **Connexion SSH** (recommandé pour les commandes de build) ou Gestionnaire de Fichiers.

---

## 🏗️ Étape 1 : Préparer l'Application pour la Production

Avant d'envoyer les fichiers, il faut builder l'application.

### 1. Configurer le Backend
Dans `backend/src/index.ts`, assurez-vous que le port est dynamique :
```typescript
const PORT = process.env.PORT || 5000;
```
*(cPanel assignera automatiquement un port via Phusion Passenger)*

### 2. Configurer le Frontend (Next.js)
Dans `frontend/next.config.mjs`, assurez-vous que le déploiement est configuré pour Node.js (pas statique).
Modifiez `package.json` du frontend pour inclure un script de démarrage compatible :
```json
"scripts": {
  "start": "next start -p $PORT"
}
```

---

## 📦 Étape 2 : Créer les Applications Node.js sur cPanel

Vous devez créer **deux** applications Node.js distinctes : une pour le backend, une pour le frontend.

### A. Application Backend (API)

1.  Allez dans cPanel > **Setup Node.js App**.
2.  Cliquez sur **Create Application**.
3.  **Node.js Version** : Choisissez la version recommandée (ex: 20.x ou 18.x).
4.  **Application Mode** : `Production`.
5.  **Application Root** : `reclamtrack-backend`.
6.  **Application URL** : `api.votre-domaine.com` (ou `votre-domaine.com/api`).
7.  **Application Startup File** : `dist/index.js` (car nous allons uploader le code compilé).
8.  Cliquez sur **Create**.
9.  Notez la commande pour entrer dans l'environnement virtuel (ex: `source /home/user/nodevenv/reclamtrack-backend/...`).

### B. Application Frontend (Next.js)

1.  Répétez l'opération.
2.  **Application Root** : `reclamtrack-frontend`.
3.  **Application URL** : `votre-domaine.com`.
4.  **Application Startup File** : `server.js` (si standalone) ou `node_modules/next/dist/bin/next` (plus complexe sur cPanel).
    *   *Astuce* : Le déploiement Next.js sur cPanel est plus facile en mode `output: 'standalone'` dans `next.config.mjs`.

---

## 📤 Étape 3 : Transférer les Fichiers

### Méthode A : Git (Recommandé)
1.  Connectez-vous en SSH.
2.  Clonez votre repo.
3.  Copiez les dossiers dans les `Application Root` créés.

### Méthode B : ZIP Upload
1.  Sur votre PC, compilez le backend :
    ```bash
    cd backend
    npm install
    npm run build
    ```
2.  Zippez le contenu de `backend` (incluant `dist`, `package.json`, `.env`). **Excluez `node_modules`** (trop lourd).
3.  Uploadez et extrayez dans le dossier `reclamtrack-backend` sur cPanel.
4.  Faites de même pour le frontend.

---

## 🔧 Étape 4 : Installation et Démarrage

### Backend
1.  Connectez-vous en SSH ou utilisez le Terminal cPanel.
2.  Activez l'environnement virtuel :
    ```bash
    source /home/user/nodevenv/reclamtrack-backend/20/bin/activate
    cd /home/user/reclamtrack-backend
    ```
3.  Installez les dépendances production :
    ```bash
    npm install --production
    ```
4.  Configurez les variables d'environnement (dans l'interface Node.js App ou fichier `.env`) :
    *   `MONGODB_URI` : Votre URL de connexion MongoDB Atlas.
    *   `JWT_SECRET` : Votre clé secrète.
5.  Redémarrez l'app via le bouton **Restart** dans cPanel.

### Frontend
1.  Activez l'environnement virtuel frontend.
2.  `npm install --production`.
3.  Build (si pas fait en local) : `npm run build`.
4.  Variables d'environnement :
    *   `NEXT_PUBLIC_API_URL` : `https://api.votre-domaine.com` (L'URL de votre backend).
5.  Redémarrez.

---

## ⚠️ Points d'Attention Spécifiques

### 1. MongoDB vs PostgreSQL
Votre serveur cPanel a PostgreSQL, mais le backend utilise **MongoDB**.
*   **Solution** : Créer un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/atlas/database).
*   Obtenez l'URI de connexion (ex: `mongodb+srv://user:pass@cluster.mongodb.net/...`).
*   Mettez cette URI dans le `.env` du backend sur cPanel.

### 2. Kafka
Le backend essaie de se connecter à Kafka. Sur un hébergement mutualisé cPanel, Kafka n'est généralement pas disponible.
*   Le backend démarrera quand même (avec des erreurs dans les logs).
*   Pour désactiver Kafka proprement, il faudrait modifier `backend/src/index.ts` pour conditionner le démarrage des services Kafka.

### 3. Fichiers Statiques
Nginx/Apache sur cPanel sert les fichiers statiques. Il faudra peut-être configurer un `.htaccess` dans le dossier frontend pour rediriger les requêtes vers le serveur Node.js.

Exemple de `.htaccess` pour le frontend :
```apache
PassengerAppRoot "/home/user/reclamtrack-frontend"
PassengerAppType node
PassengerStartupFile server.js
```
