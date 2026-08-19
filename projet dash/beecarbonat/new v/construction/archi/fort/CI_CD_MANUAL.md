# Manuel d'Intégration et de Déploiement Continu (CI/CD)

Ce document détaille la stratégie CI/CD mise en place pour ReclamTrack.

## 1. Intégration Continue (CI)

Nous utilisons **GitHub Actions** pour l'intégration continue. Le workflow est défini dans `.github/workflows/integration.yml`.

### Ce que fait le CI :
À chaque `push` ou `pull_request` sur les branches `main` et `develop` :
1.  **Checkout** du code.
2.  **Installation** des dépendances (`npm ci` à la racine).
3.  **Shared** : Build du package partagé `@reclamtrack/shared`.
4.  **Backend** :
    *   **Linting** : Vérification de la qualité du code (`npm run lint`).
    *   **Build** : Compilation TypeScript (`tsc`).
5.  **Frontend** :
    *   **Linting** : Vérification Next.js (`next lint`).
    *   **Build** : Compilation de production (`next build`).

### Vérification locale
Avant de pousser votre code, vous pouvez simuler le CI localement en exécutant :
```bash
./verify_ci.bat
```

## 2. Déploiement Continu (CD) - Stratégie Docker

Le projet est conteneurisé via `docker-compose.yml`.

### Prérequis
*   Docker et Docker Compose installés sur le serveur.
*   Accès au dépôt Git ou à un registre d'images (Docker Hub, GHCR).

### Déploiement via Docker Compose (Méthode Recommandée)

Sur votre serveur de production/staging :

1.  **Récupérer le code** :
    ```bash
    git pull origin main
    ```

2.  **Lancer les services** :
    ```bash
    docker-compose up -d --build
    ```
    *   `--build` force la reconstruction des images avec le dernier code.
    *   `-d` lance les conteneurs en arrière-plan.

### Architecture des Conteneurs
*   **Frontend** : Port 3000
*   **Backend** : Port 5001 (via API Gateway) ou 5009 (Direct)
*   **Microservices** : Ports 3001-3006
*   **Infrastructure** : MongoDB (27017), Kafka (9092), Zookeeper (2181)

## 3. Évolutions Futures
Pour automatiser le déploiement (sauter l'étape manuelle sur le serveur), vous pouvez :
1.  Configurer un **Runner GitHub Actions auto-hébergé** sur votre VPS.
2.  Ajouter une étape SSH dans le fichier `.yml` pour se connecter au serveur et lancer `docker-compose up`.
3.  Utiliser un registre d'images (Docker Hub) pour builder les images dans le CI et les puller sur le serveur.

---
**Note** : Le CI est actuellement configuré en mode "warning" pour le linting (`continue-on-error: true`) afin de ne pas bloquer le développement initial. Pensez à corriger les erreurs de linting progressivement.
