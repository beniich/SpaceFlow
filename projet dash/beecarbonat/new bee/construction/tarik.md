# Instructions de Démarrage pour Tarik

Voici les étapes pour démarrer l'application **ReclamTrack** dans VSCode.

## Prérequis

Assurez-vous d'avoir installé :

1.  **Node.js** (version 18 ou supérieure recommandée).
2.  **VSCode**.

## Démarrage Rapide

J'ai créé un script automatique nommé `tarik.ps1` pour vous faciliter la tâche.

### Étape 1 : Ouvrir le projet dans VSCode

Ouvrez le dossier root `reclamtrack` dans VSCode.

### Étape 2 : Ouvrir le Terminal

Ouvrez le terminal intégré de VSCode :

- Menu : **Terminal** > **New Terminal**
- Raccourci : `Ctrl + ù` (ou `Ctrl + ` selon votre clavier)

### Étape 3 : Lancer le script

Dans le terminal, tapez la commande suivante et appuyez sur **Entrée** :

```powershell
.\tarik.ps1
```

Cela va automatiquement :

1.  Installer les dépendances (si nécessaire).
2.  Configurer l'environnement de base.
3.  Lancer le **Backend** (port 5001) et le **Frontend** (port 3000) simultanément.

---

## Démarrage Manuel (Alternative)

Si vous préférez taper les commandes vous-même :

1.  **Installer les dépendances** :

    ```bash
    npm install
    npm run install:all
    ```

2.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    ```

## Accès à l'application

Une fois le script lancé, ouvrez votre navigateur :

- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **Backend API** : [http://localhost:5001](http://localhost:5001)

## Arrêter l'application

Pour arrêter les serveurs, cliquez dans le terminal et faites `Ctrl + C`, puis confirmez avec `o` (ou `y`).
