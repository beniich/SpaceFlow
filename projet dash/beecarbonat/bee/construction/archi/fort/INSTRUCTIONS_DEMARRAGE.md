# 🚀 ReclamTrack - Instructions de Démarrage

## ✅ Solution Rapide : Double-clic

**Fichier à lancer :** `LANCER.cmd`

1. Allez dans le dossier `c:\Users\pc gold\Desktop\ticket\reclamtrack`
2. **Double-cliquez sur `LANCER.cmd`**
3. Le script va tout installer automatiquement et lancer le serveur

## 📋 OU via PowerShell

Si vous préférez utiliser PowerShell directement :

```powershell
cd "c:\Users\pc gold\Desktop\ticket\reclamtrack"
.\START_DEV.ps1
```

## 🌐 Accès à l'Application

Une fois le serveur démarré, ouvrez votre navigateur et accédez à :

- **Login :** http://localhost:3000/login
- **Dashboard :** http://localhost:3000/dashboard

## 🛑 Pour Arrêter le Serveur

Appuyez sur `Ctrl + C` dans le terminal

---

## ⚠️ En Cas de Problème

Si vous rencontrez une erreur "Execution Policy", exécutez ceci dans PowerShell (en **Administrateur**) :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Puis relancez `LANCER.cmd`.

---

**Note :** Les scripts `START_DEV.bat` et `START_DEV.ps1` font la même chose, mais `.ps1` est optimisé pour PowerShell.
