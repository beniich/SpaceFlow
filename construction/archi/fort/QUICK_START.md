# 🚀 Guide de Démarrage Rapide - ReclamTrack

## ⚡ Démarrage en 5 Minutes

### Étape 1 : Définir le Workspace (30 secondes)

**Dans VS Code :**
```
Fichier → Ouvrir le dossier → Sélectionner :
C:\Users\pc gold\projet dash\ticket\reclamtrack
```

**OU en ligne de commande :**
```bash
cd "C:\Users\pc gold\projet dash\ticket\reclamtrack"
code .
```

---

### Étape 2 : Installer les Dépendances (2-3 minutes)

```bash
# À la racine du projet
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

---

### Étape 3 : Configurer les Variables d'Environnement (1 minute)

#### Backend
```bash
cd backend
cp .env.example .env
```

Éditez `backend/.env` :
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/reclamtrack
JWT_SECRET=votre-secret-key-tres-securise-changez-moi
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASSWORD=your_password
```

#### Frontend
```bash
cd ../frontend
cp .env.example .env
```

Éditez `frontend/.env` :
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

---

### Étape 4 : Lancer l'Application (30 secondes)

**Option 1 : Tout en une commande (recommandé)**
```bash
# À la racine
npm run dev
```

**Option 2 : Séparément**
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

---

### Étape 5 : Vérifier que Tout Fonctionne (30 secondes)

Ouvrez votre navigateur :

- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:5001/api
- **Socket.IO :** http://localhost:5001

**Checklist :**
- [ ] La landing page s'affiche
- [ ] Les Material Symbols Icons sont visibles
- [ ] Les couleurs sont harmonisées
- [ ] Les animations fonctionnent
- [ ] Pas d'erreur dans la console

---

## 🎯 Accès Rapide

### URLs Principales

| Page | URL | Description |
|------|-----|-------------|
| Landing | http://localhost:3000 | Page d'accueil |
| Login | http://localhost:3000/login | Connexion |
| Register | http://localhost:3000/register | Inscription |
| Dashboard | http://localhost:3000/dashboard | Tableau de bord |
| Complaints | http://localhost:3000/complaints | Réclamations |
| New Complaint | http://localhost:3000/complaints/new | Nouvelle réclamation |

### API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/login` | POST | Connexion |
| `/api/auth/register` | POST | Inscription |
| `/api/complaints` | GET | Liste réclamations |
| `/api/complaints` | POST | Créer réclamation |
| `/api/teams` | GET | Liste équipes |
| `/api/dashboard` | GET | Stats dashboard |

---

## 🔧 Commandes Utiles

### Développement

```bash
# Lancer le serveur de développement
npm run dev

# Lancer uniquement le frontend
cd frontend && npm run dev

# Lancer uniquement le backend
cd backend && npm run dev
```

### Build

```bash
# Build de production
npm run build

# Build frontend uniquement
cd frontend && npm run build

# Build backend uniquement
cd backend && npm run build
```

### Tests

```bash
# Lancer les tests (si configurés)
npm test

# Vérifier TypeScript
cd frontend && npx tsc --noEmit

# Linter
cd frontend && npm run lint
```

---

## 📁 Structure Rapide

```
reclamtrack/
├── frontend/               # Next.js 15 + React 19
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   │   ├── (public)/  # Pages publiques
│   │   │   ├── (auth)/    # Authentification
│   │   │   └── (app)/     # Application (protégée)
│   │   ├── components/    # Composants UI
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── lib/           # Utilitaires
│   │   ├── store/         # Zustand stores
│   │   └── styles/        # CSS global
│   └── package.json
│
├── backend/               # Express + MongoDB
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── models/        # Modèles Mongoose
│   │   ├── routes/        # Routes API
│   │   ├── middleware/    # Middlewares
│   │   ├── services/      # Services
│   │   └── index.ts       # Point d'entrée
│   └── package.json
│
└── package.json           # Workspace root
```

---

## 🎨 Nouvelles Fonctionnalités

### Classes CSS Utilitaires

```tsx
// Glassmorphism
<div className="glass-effect">...</div>

// Hover effect
<div className="card-hover">...</div>

// Animations
<div className="animate-fade-in">...</div>
<div className="animate-slide-in-left">...</div>
```

### Couleurs

```tsx
// Primary colors
<div className="bg-primary-500">...</div>
<div className="text-primary-600">...</div>

// Status colors
<span className="bg-status-new">Nouveau</span>
<span className="bg-status-progress">En cours</span>
<span className="bg-status-resolved">Résolu</span>

// Semantic colors
<div className="text-success">Succès</div>
<div className="text-warning">Attention</div>
<div className="text-error">Erreur</div>
```

---

## 🐛 Dépannage Rapide

### MongoDB ne se connecte pas

```bash
# Vérifier que MongoDB est démarré
mongod

# OU avec MongoDB Compass
# Vérifier la connexion à mongodb://localhost:27017
```

### Port déjà utilisé

```bash
# Trouver le processus utilisant le port 3000
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

### Material Symbols ne s'affichent pas

1. Vérifiez votre connexion internet
2. Videz le cache du navigateur (Ctrl + Shift + R)
3. Vérifiez que le `<link>` est dans `<head>`

### Erreurs TypeScript

```bash
# Réinstaller les dépendances
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

### Guides Disponibles

1. **`README_REORGANIZATION.md`** - Guide principal
2. **`MIGRATION_GUIDE.md`** - Guide de migration détaillé
3. **`REORGANIZATION_PLAN.md`** - Plan de réorganisation
4. **`BEFORE_AFTER_COMPARISON.md`** - Comparaison avant/après
5. **`SUMMARY_REORGANIZATION.md`** - Résumé détaillé

### Liens Utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Material Symbols](https://fonts.google.com/icons)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)

---

## ✅ Checklist de Démarrage

- [ ] Workspace défini dans VS Code
- [ ] Dépendances installées (root, frontend, backend)
- [ ] Variables d'environnement configurées
- [ ] MongoDB démarré (si local)
- [ ] Serveur de développement lancé
- [ ] Landing page accessible
- [ ] Material Symbols visibles
- [ ] Pas d'erreur dans la console
- [ ] Backend API répond

---

## 🎯 Prochaines Étapes

Une fois que tout fonctionne :

1. **Tester l'authentification**
   - Créer un compte
   - Se connecter
   - Accéder au dashboard

2. **Explorer l'application**
   - Créer une réclamation
   - Voir la liste des réclamations
   - Tester les différentes pages

3. **Migrer les routes restantes**
   - Suivre le `MIGRATION_GUIDE.md`
   - Déplacer les routes vers `(app)/`
   - Mettre à jour les imports

4. **Personnaliser**
   - Modifier les couleurs dans `globals.css`
   - Ajouter vos propres composants
   - Implémenter vos fonctionnalités

---

## 💡 Conseils

### Performance

- Utilisez les variables CSS au lieu de valeurs hardcodées
- Réutilisez les utility classes (`.glass-effect`, `.card-hover`)
- Optimisez les images avec Next.js `<Image>`

### Développement

- Utilisez les hooks personnalisés (`useAuth`, `useSocket`)
- Suivez la structure de dossiers établie
- Documentez vos changements

### Sécurité

- Ne committez jamais les fichiers `.env`
- Changez le `JWT_SECRET` en production
- Validez toutes les entrées utilisateur

---

## 🆘 Besoin d'Aide ?

### Problèmes Courants

**"Cannot find module"**
```bash
npm install
```

**"Port already in use"**
```bash
# Changez le port dans .env
PORT=5002
```

**"MongoDB connection failed"**
```bash
# Vérifiez MONGODB_URI dans .env
# Assurez-vous que MongoDB est démarré
```

---

## 🎉 Vous êtes Prêt !

Si vous avez suivi toutes les étapes, votre application devrait maintenant fonctionner parfaitement !

**Prochaine action :** Explorez l'application et commencez à développer ! 🚀

---

**Date :** 8 février 2026  
**Version :** 1.0.0  
**Statut :** ✅ Prêt à démarrer
