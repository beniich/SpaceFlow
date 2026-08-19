# Secrets GitHub pour ReclamTrack (CI/CD)

Pour que l'intégration et le déploiement continu (CI/CD) fonctionnent correctement, vous devez configurer des **Secrets** dans votre dépôt GitHub.

## 📍 Où les ajouter ?
1.  Allez sur votre dépôt GitHub.
2.  Cliquez sur **Settings** (Paramètres).
3.  Dans le menu de gauche, allez dans **Secrets and variables** > **Actions**.
4.  Cliquez sur **New repository secret**.

---

## 🔐 Liste des Secrets Requis

### 1. Build & Test (Frontend & Backend)
Ces secrets sont utilisés par GitHub Actions lors de la compilation (`npm run build`) et des tests.

| Nom du Secret | Description | Exemple de Valeur |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL de l'API Backend (pour le build Frontend) | `https://api.reclamtrack.com` ou `http://localhost:5001` (si build local) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Clé Client Google OAuth (Frontend) | `123456789-abc...apps.googleusercontent.com` |

> *Note : GitHub Actions ne peut pas lire vos fichiers `.env` locaux. C'est pourquoi ces variables doivent être définies ici.*

### 2. Déploiement vers Docker Hub (Optionnel)
Si vous souhaitez pousser vos images Docker vers un registre privé.

| Nom du Secret | Description |
| :--- | :--- |
| `DOCKERHUB_USERNAME` | Votre nom d'utilisateur Docker Hub |
| `DOCKERHUB_TOKEN` | Token d'accès Docker Hub (ou mot de passe) |

### 3. Déploiement vers Serveur VPS (Optionnel)
Si vous souhaitez automatiser le déploiement sur votre serveur via SSH.

| Nom du Secret | Description |
| :--- | :--- |
| `SSH_HOST` | Adresse IP ou domaine de votre serveur |
| `SSH_USER` | Nom d'utilisateur SSH (ex: `root` ou `ubuntu`) |
| `SSH_KEY` | Clé privée SSH (copiez tout le contenu de votre `.pem` ou `id_rsa`) |
| `SSH_PORT` | Port SSH (par défaut : `22`) |

---

## 📝 Exemple de Configuration (déjà inclus)

Dans votre fichier `.github/workflows/integration.yml`, ces secrets sont référencés comme ceci :

```yaml
env:
  NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_GOOGLE_CLIENT_ID }}
```

## ⚠️ Sécurité
*   **Ne committez jamais** vos fichiers `.env` ou clés privées dans le code source.
*   Utilisez toujours les **Secrets GitHub** pour les valeurs sensibles.
*   Les secrets ne sont visibles qu'au moment de leur création/mise à jour, vous ne pourrez plus les lire après.
