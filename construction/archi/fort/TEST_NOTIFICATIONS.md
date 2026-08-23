# 🔔 Guide de Test - Système de Notifications en Temps Réel

## ✅ État Actuel

- **Frontend** : http://localhost:3000 ✅ Démarré
- **Backend** : http://localhost:5001 ✅ Démarré (Mode DÉMO)
- **Socket.IO** : ✅ Configuré
- **Notifications** : ✅ Prêt à tester

---

## 🧪 Comment Tester les Notifications

### Étape 1 : Ouvrir l'Application
1. Ouvre ton navigateur
2. Va sur **http://localhost:3000**
3. Tu devrais voir la page d'accueil de ReclamTrack

### Étape 2 : Envoyer une Notification de Test

**Option A : Avec PowerShell**
```powershell
# Ouvre un nouveau terminal PowerShell et exécute :
Invoke-WebRequest -Uri "http://localhost:5001/api/test-notification" -Method POST
```

**Option B : Avec curl (si installé)**
```bash
curl -X POST http://localhost:5001/api/test-notification
```

**Option C : Avec ton navigateur**
1. Ouvre un nouvel onglet
2. Colle cette URL dans la barre d'adresse :
   ```
   http://localhost:5001/api/test-notification
   ```
3. Appuie sur Entrée
4. Retourne sur l'onglet http://localhost:3000

### Étape 3 : Observer le Résultat
Une notification devrait apparaître en **haut à droite** de ton écran avec :
- ✅ Icône de succès (vert)
- 📝 Titre : "Test Notification"
- 💬 Message : "Le système de notifications fonctionne parfaitement ! 🎉"

---

## 🎨 Types de Notifications Disponibles

Tu peux tester différents types de notifications en modifiant le backend :

### Notification de Succès (Vert)
```typescript
type: 'success'
```

### Notification d'Erreur (Rouge)
```typescript
type: 'error'
```

### Notification d'Avertissement (Orange)
```typescript
type: 'warning'
```

### Notification d'Information (Bleu)
```typescript
type: 'info'
```

---

## 🔧 Prochaines Étapes

### 1. Intégrer les Notifications dans les Routes Existantes

Exemple pour les réclamations :
```typescript
// Dans backend/src/routes/complaints.ts
import notificationService from '../services/socketService.js';

// Quand une nouvelle réclamation est créée
notificationService.broadcast({
    type: 'info',
    title: 'Nouvelle Réclamation',
    message: `Réclamation #${complaint.id} créée par ${user.name}`,
    timestamp: new Date()
});
```

### 2. Notifications Ciblées par Utilisateur
```typescript
// Envoyer à un utilisateur spécifique
notificationService.sendToUser(userId, {
    type: 'success',
    title: 'Réclamation Assignée',
    message: 'Une nouvelle réclamation vous a été assignée',
    timestamp: new Date()
});
```

### 3. Notifications par Équipe
```typescript
// Envoyer à une équipe spécifique
notificationService.sendToRoom(`team-${teamId}`, {
    type: 'warning',
    title: 'Charge de Travail Élevée',
    message: 'Votre équipe a 15 réclamations en attente',
    timestamp: new Date()
});
```

---

## 📊 Dashboard Analytics en Temps Réel (Prochaine Étape)

Après avoir validé les notifications, nous pourrons implémenter :

1. **Statistiques Live** : Nombre de réclamations en temps réel
2. **Graphiques Dynamiques** : Mise à jour automatique sans rechargement
3. **Alertes Intelligentes** : Notifications basées sur des seuils
4. **Tableau de Bord Interactif** : Visualisation des données en direct

---

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend ?
- Vérifie que les deux serveurs tournent
- Vérifie la console du navigateur (F12) pour les erreurs

### Les notifications n'apparaissent pas ?
- Vérifie que tu es bien sur http://localhost:3000
- Ouvre la console du navigateur (F12) pour voir les logs Socket.IO
- Vérifie que le backend affiche "🔔 Client connecté"

### Erreur CORS ?
- Le CORS est déjà configuré pour accepter toutes les origines en développement
- Si problème persiste, vérifie `backend/src/index.ts` ligne 28

---

## 📝 Notes

- **Mode DÉMO** : Le backend fonctionne sans MongoDB (données en mémoire)
- **Données Persistantes** : Pour sauvegarder les données, configure MongoDB Atlas
- **Production** : N'oublie pas de sécuriser les endpoints et configurer CORS correctement

---

Bon test ! 🚀
