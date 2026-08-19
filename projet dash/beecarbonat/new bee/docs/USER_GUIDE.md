# 📘 Guide d'Utilisation - CAFM Pro (Rezidet)

Bienvenue dans le guide d'utilisation de **CAFM Pro (Rezidet)**. Ce document vous guide à travers les fonctionnalités principales de la plateforme pour la gestion des actifs, de la maintenance (GMAO), du CRM, et de l'intelligence artificielle.

---

## 🚀 1. Tableau de Bord (Dashboard)
Le Dashboard est le centre névralgique de votre application. Il offre une vue globale et en temps réel de votre parc immobilier et des opérations.

- **KPIs Exécutifs :** Résumé instantané des actifs totaux, de leur disponibilité, des revenus générés, et du retour sur investissement (ROI).
- **Opérations :** Visualisez les Ordres de Travail (Work Orders) ouverts, résolus, et en attente.
- **Prédictions IA :** La plateforme identifie automatiquement les anomalies potentielles de consommation énergétique ou de pannes matérielles avant qu'elles ne surviennent.

---

## 🏢 2. Gestion des Actifs (Assets)
Ce module vous permet de recenser et suivre le cycle de vie de tous vos équipements (CVC, ascenseurs, plomberie, etc.).

1. **Liste des Actifs :** Visualisez l'état (Opérationnel, En Maintenance, En Panne, Retiré) de chaque actif.
2. **Ajouter un Actif :** 
   - Cliquez sur **"Nouvel Actif"**.
   - Renseignez les informations (Nom, Catégorie, Numéro de série, Emplacement, Valeur).
   - Validez.
3. **Statut de Santé :** Un score de santé (`healthScore`) est attribué aux actifs connectés (capteurs IoT) pour anticiper leur usure.
4. **Maintenance :** Accédez directement à l'historique des pannes et interventions de chaque actif depuis sa page de détail.

---

## 🛠️ 3. Ordres de Travail (Work Orders)
C'est ici que sont gérées les interventions correctives et préventives (GMAO).

1. **Cycle de Vie d'un WO :**
   - **PENDING :** En attente de traitement.
   - **IN_PROGRESS :** En cours par un technicien.
   - **COMPLETED :** Intervention terminée (la plateforme met automatiquement à jour le statut de l'actif concerné et enregistre un Log de Maintenance).
   - **CANCELLED :** Demande annulée.
2. **Création rapide :** Vous pouvez associer un Ordre de Travail à un technicien spécifique, définir sa priorité (Basse, Moyenne, Haute, Critique) et son coût estimé.
3. **Mise à jour rapide :** Utilisez l'interface Kanban pour faire glisser vos interventions entre les colonnes de statuts.

---

## 👥 4. CRM & Contacts
Pour un suivi fluide de vos locataires, clients, prospects ou prestataires de services.

1. **Annuaire Paginé :** Filtrage avancé par type de profil (Lead, Prospect, Client, Partenaire, Fournisseur).
2. **Fiche Contact :** Centralise toutes les communications, baux, contrats, et tickets associés à un contact donné.
3. **Ajout Rapide :** Des modales dédiées vous permettent d'ajouter des contacts en un clic, à n'importe quel moment de la navigation.

---

## 🤝 5. Opportunités (Deals)
Le pipeline commercial de la plateforme CAFM.
- Suivi du CA potentiel pour les renouvellements de baux, ou pour l'upsell de prestations de maintenance.
- Interface de pipeline structurée (Nouveau, En négociation, Gagné, Perdu).

---

## 🤖 6. Fonctionnalités Avancées (Sentry, Swagger)
- **Monitoring et Sécurité :** L'application est protégée contre les requêtes massives (Rate Limiting) et le code malveillant (Sanitization XSS). Les erreurs techniques inattendues sont envoyées en temps réel (via Sentry) pour permettre à l'équipe technique de réagir instantanément.
- **Documentation API (Swagger) :** Les développeurs ou partenaires externes peuvent explorer l'API en visitant la route `/api-docs` du backend. Toutes les routes (Actifs, Ordres de Travail, Auth, CRM) sont documentées.

---

## ❓ FAQ & Aide

**Comment me connecter si j'oublie mon mot de passe ?**  
Un module de réinitialisation est en place via votre email, contactez votre administrateur si l'email ne vous parvient pas.

**L'application fonctionne-t-elle sur mobile ?**  
Oui. Une PWA (Progressive Web App) intégrée permet à l'application de s'adapter aux smartphones, et un logo sera installé sur votre écran d'accueil.

---
*Ce guide a été généré automatiquement dans le cadre de l'industrialisation CAFM Pro.*
