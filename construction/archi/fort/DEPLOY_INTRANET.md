# 🏢 Guide de Déploiement Interne (Intranet / On-Premise)

Ce guide explique comment installer **ReclamTrack** sur un serveur local au sein de votre entreprise, accessible uniquement via votre réseau interne (LAN/VPN), sans passer par Internet.

---

## 📋 Prérequis Matériel & Logiciel

### Le Serveur Interne
Vous pouvez utiliser un serveur dédié, un NAS (supportant Docker), ou même un PC de bureau robuste qui restera allumé.

*   **OS Recommandé** : Ubuntu Server 22.04 LTS (Stable & Léger). Windows Pro avec Docker Desktop fonctionne aussi mais consomme plus de ressources.
*   **CPU** : 2 cœurs minimum (4 recommandés).
*   **RAM** : 8 Go (pour faire tourner Kafka, Mongo, Node.js confortablement).
*   **Disque** : SSD 50 Go+.
*   **Réseau** : Le serveur doit avoir une **IP Locale Fixe** (ex: `192.168.1.50`). Demandez à votre admin réseau ou configurez-le dans le routeur.

### Logiciels à installer sur le serveur
*   [Docker](https://docs.docker.com/engine/install/)
*   [Docker Compose](https://docs.docker.com/compose/install/)
*   Git

---

## ⚙️ Configuration Spécifique Intranet

L'étape la plus importante est de configurer les adresses IP pour que les PC de vos collègues puissent "voir" le serveur.

Hypothèse : L'IP de votre serveur est **`192.168.1.50`**.

### 1. Configuration Backend
Modifiez le fichier `backend/.env` (ou les variables d'environnement dans docker-compose) :
```ini
# Autoriser les requêtes venant du frontend sur le réseau
CORS_ORIGIN=http://192.168.1.50:3000
PORT=5001
```

### 2. Configuration Frontend
Modifiez le fichier `frontend/.env` **AVANT** de construire l'image Docker.
C'est crucial car le code Frontend s'exécute dans le **navigateur des utilisateurs**, pas sur le serveur. Il doit savoir où contacter l'API.

```ini
# ⚠️ Ne mettez PAS "localhost" ici, sinon ça ne marchera que SUR le serveur lui-même.
# Mettez l'IP du serveur accessible par les autres PC.
NEXT_PUBLIC_API_URL=http://192.168.1.50:5001
```

---

## 🚀 Installation & Démarrage

Sur votre serveur interne :

1.  **Récupérer le projet** :
    ```bash
    git clone https://votre-repo/reclamtrack.git
    cd reclamtrack
    ```

2.  **Lancer avec Docker Compose** :
    ```bash
    # Construire et lancer en arrière-plan
    docker-compose up -d --build
    ```

3.  **Vérifier les logs** (optionnel) :
    ```bash
    docker-compose logs -f backend
    ```

---

## 🖥️ Accès Utilisateurs

Une fois lancé, envoyez simplement l'adresse à vos collaborateurs.

URL d'accès : **`http://192.168.1.50:3000`**

*   Les techniciens sur leur tablette/téléphone connectés au WiFi de l'entreprise peuvent aussi y accéder via cette URL.
*   Pour un accès depuis l'extérieur (maison), il faudra configurer un **VPN** vers votre réseau interne (plus sécurisé que d'ouvrir les ports sur Internet).

---

## 🛡️ Maintenance & Sauvegardes

Pensez à sauvegarder régulièrement le volume de base de données Docker.
Script de backup simple (MongoDB) :
```bash
docker exec mongo mongodump --out /dump
docker cp mongo:/dump ./backup_$(date +%F)
```
