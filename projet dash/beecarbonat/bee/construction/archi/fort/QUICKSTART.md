# 🚀 Quick Start Guide - ReclamTrack

Ce guide vous permettra de démarrer rapidement avec ReclamTrack en quelques minutes.

---

## ⚡ Démarrage Rapide (5 minutes)

### 1. Prérequis

Assurez-vous d'avoir installé :
- ✅ **Node.js 18+** ([Télécharger](https://nodejs.org/))
- ✅ **MongoDB 6+** ([Télécharger](https://www.mongodb.com/try/download/community))
- ✅ **Git** ([Télécharger](https://git-scm.com/))

### 2. Installation

```bash
# Cloner le repository
cd C:\Users\pc gold\Desktop\ticket\reclamtrack

# Installer les dépendances Backend
cd backend
npm install

# Installer les dépendances Frontend
cd ../frontend
npm install
```

### 3. Configuration

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Éditer `backend/.env` :
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/reclamtrack
JWT_SECRET=votre_secret_jwt_ici_changez_moi
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)

```bash
cd ../frontend
cp .env.example .env.local
```

Éditer `frontend/.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=ReclamTrack
```

### 4. Démarrer MongoDB

```bash
# Windows
# MongoDB devrait démarrer automatiquement après installation
# Sinon, démarrer manuellement :
mongod

# Vérifier que MongoDB fonctionne
mongosh
# Vous devriez voir le prompt MongoDB
```

### 5. Lancer l'Application

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
✅ Server running on port 5000
✅ MongoDB connected
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Vous devriez voir :
```
✅ Ready on http://localhost:3000
```

### 6. Accéder à l'Application

Ouvrez votre navigateur et allez à :
```
http://localhost:3000
```

---

## 👤 Créer un Compte de Test

### Option 1 : Via l'Interface

1. Aller sur `http://localhost:3000/register`
2. Remplir le formulaire :
   - **Email** : admin@test.com
   - **Nom** : Admin Test
   - **Mot de passe** : Test123!
   - **Rôle** : Admin
3. Cliquer sur "S'inscrire"

### Option 2 : Via MongoDB

```bash
# Ouvrir MongoDB shell
mongosh

# Utiliser la base de données
use reclamtrack

# Créer un utilisateur admin
db.users.insertOne({
    name: "Admin Test",
    email: "admin@test.com",
    password: "$2a$10$YourHashedPasswordHere",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
})
```

---

## 🗺️ Navigation dans l'Application

### Pages Principales

| Page | URL | Description |
|------|-----|-------------|
| **Dashboard** | `/dashboard` | Vue d'ensemble opérationnelle |
| **Réclamations** | `/complaints/list` | Liste des réclamations |
| **Nouvelle Réclamation** | `/complaints/new` | Créer une réclamation |
| **Équipes** | `/teams` | Gestion des équipes |
| **Planning** | `/planning` | Planning des interventions |
| **Carte** | `/map` | Vue cartographique |
| **Analytics** | `/analytics` | Statistiques et graphiques |
| **Messages** | `/messages` | Messagerie interne |
| **Paramètres** | `/settings` | Paramètres utilisateur |
| **Admin** | `/admin` | Administration système |
| **Flotte** | `/fleet` | Gestion de la flotte |
| **Roster** | `/roster` | Planning des équipes |

---

## 🧪 Tester les Fonctionnalités

### 1. Créer une Réclamation

```bash
# Via l'interface
1. Aller sur /complaints/new
2. Remplir le formulaire
3. Soumettre

# Via API (Postman/cURL)
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Fuite d'eau",
    "description": "Fuite importante rue principale",
    "category": "water",
    "location": {
      "address": "Rue Principale, Rabat",
      "coordinates": {
        "lat": 33.9716,
        "lng": -6.8498
      }
    },
    "priority": "urgent"
  }'
```

### 2. Créer une Équipe

```bash
# Via l'interface
1. Aller sur /teams
2. Cliquer sur "Nouvelle Équipe"
3. Remplir les informations
4. Ajouter des membres
5. Sauvegarder

# Via API
curl -X POST http://localhost:5000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Équipe A",
    "specialization": "water",
    "members": ["user_id_1", "user_id_2"],
    "status": "available"
  }'
```

### 3. Assigner une Intervention

```bash
# Via l'interface
1. Aller sur /planning
2. Sélectionner une réclamation
3. Choisir une équipe
4. Définir la date/heure
5. Confirmer l'assignation
```

---

## 🔧 Commandes Utiles

### Backend

```bash
# Démarrer en mode développement
npm run dev

# Démarrer en mode production
npm start

# Lancer les tests
npm test

# Vérifier le code
npm run lint

# Build (si TypeScript)
npm run build

# Seed la base de données
npm run seed
```

### Frontend

```bash
# Démarrer en mode développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Lancer les tests
npm test

# Vérifier le code
npm run lint

# Formater le code
npm run format
```

---

## 📊 Données de Test

### Créer des Données de Test

Créer un fichier `backend/scripts/seed.js` :

```javascript
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Complaint = require('../src/models/Complaint');
const Team = require('../src/models/Team');

async function seed() {
    await mongoose.connect('mongodb://localhost:27017/reclamtrack');

    // Créer des utilisateurs
    const users = await User.insertMany([
        {
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'hashedPassword',
            role: 'admin'
        },
        {
            name: 'Manager User',
            email: 'manager@test.com',
            password: 'hashedPassword',
            role: 'manager'
        },
        {
            name: 'Technician User',
            email: 'tech@test.com',
            password: 'hashedPassword',
            role: 'technician'
        }
    ]);

    // Créer des équipes
    const teams = await Team.insertMany([
        {
            name: 'Équipe Eau A',
            specialization: 'water',
            members: [users[1]._id, users[2]._id],
            status: 'available'
        },
        {
            name: 'Équipe Électricité B',
            specialization: 'electricity',
            members: [users[2]._id],
            status: 'available'
        }
    ]);

    // Créer des réclamations
    await Complaint.insertMany([
        {
            title: 'Fuite d'eau importante',
            description: 'Fuite d'eau sur la rue principale',
            category: 'water',
            status: 'new',
            priority: 'urgent',
            location: {
                address: 'Rue Principale, Rabat',
                coordinates: { lat: 33.9716, lng: -6.8498 }
            },
            createdBy: users[0]._id
        },
        {
            title: 'Lampadaire défectueux',
            description: 'Lampadaire ne fonctionne plus',
            category: 'lighting',
            status: 'in_progress',
            priority: 'normal',
            location: {
                address: 'Avenue Hassan II, Rabat',
                coordinates: { lat: 33.9716, lng: -6.8498 }
            },
            createdBy: users[0]._id,
            assignedTo: teams[1]._id
        }
    ]);

    console.log('✅ Données de test créées avec succès !');
    process.exit(0);
}

seed().catch(console.error);
```

Exécuter :
```bash
node backend/scripts/seed.js
```

---

## 🐛 Dépannage

### Problème : Backend ne démarre pas

**Erreur** : `MongoDB connection error`

**Solution** :
```bash
# Vérifier que MongoDB est démarré
mongosh

# Si erreur, démarrer MongoDB
mongod

# Vérifier l'URL dans .env
MONGODB_URI=mongodb://localhost:27017/reclamtrack
```

### Problème : Frontend erreur 500

**Erreur** : `Failed to fetch from API`

**Solution** :
```bash
# Vérifier que le backend est démarré
cd backend
npm run dev

# Vérifier l'URL de l'API dans frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Problème : Port déjà utilisé

**Erreur** : `Port 3000 is already in use`

**Solution** :
```bash
# Windows - Trouver et tuer le processus
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou changer le port dans package.json
"dev": "next dev -p 3001"
```

### Problème : Erreurs TypeScript

**Solution** :
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Ou ignorer temporairement (développement seulement)
# Dans next.config.js
typescript: {
  ignoreBuildErrors: true
}
```

---

## 📚 Ressources

### Documentation

- **README.md** - Vue d'ensemble du projet
- **STATUS.md** - État actuel de l'application
- **DEPLOYMENT.md** - Guide de déploiement
- **CONTRIBUTING.md** - Guide de contribution

### Liens Utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Support

- **Email** : support@reclamtrack.com
- **Issues** : GitHub Issues
- **Discussions** : GitHub Discussions

---

## ✅ Checklist de Démarrage

- [ ] Node.js 18+ installé
- [ ] MongoDB installé et démarré
- [ ] Repository cloné
- [ ] Dépendances backend installées
- [ ] Dépendances frontend installées
- [ ] Fichier .env backend configuré
- [ ] Fichier .env.local frontend configuré
- [ ] Backend démarré (port 5000)
- [ ] Frontend démarré (port 3000)
- [ ] Compte utilisateur créé
- [ ] Application accessible dans le navigateur
- [ ] Données de test créées (optionnel)

---

## 🎉 Vous êtes prêt !

Votre environnement de développement ReclamTrack est maintenant configuré et prêt à l'emploi !

**Prochaines étapes** :
1. Explorer l'interface utilisateur
2. Tester les différentes fonctionnalités
3. Consulter le code source
4. Commencer à développer !

**Bon développement ! 🚀**

---

**Dernière mise à jour** : 7 Février 2026
