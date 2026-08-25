# 📱 Métadonnées Officielles Stores (App Store & Google Play)

Ce document centralise toutes les informations requises pour la soumission de l'application **BeeCarbonIT (SpaceFlow)** sur l'App Store (Apple) et le Google Play Store (Google).

---

## 🍏 App Store (iOS)

| Champ | Contenu | Limite |
|---|---|---|
| **Nom de l'app** | BeeCarbonIT - Maintenance Intelligente | 30 car. |
| **Sous-titre** | GMAO terrain pour équipes industrie | 30 car. |
| **Catégorie principale** | Business | - |
| **Catégorie secondaire** | Productivity | - |
| **Bundle ID** | `io.beecarbonit.mobile` | - |
| **SKU** | `beecarbonit-ios` | - |
| **Mots-clés (Keywords)** | `gmao,maintenance,cmms,industrie,work order,ticket,asset,scanner qr,terrain,offline` | 100 car. |
| **URL de support** | `https://support.beecarbonit.com` | URL valide |
| **URL marketing** | `https://beecarbonit.com` | URL valide |
| **Politique de confidentialité** | `https://beecarbonit.com/privacy` | URL valide |

### Description App Store (FR)
```text
🐝 BeeCarbonIT est la plateforme de gestion de maintenance (GMAO) qui digitalise vos interventions terrain. Conçue pour les techniciens et managers de l'industrie 4.0, elle offre tous les outils pour gérer vos équipements, ordres de travail et tickets en mobilité complète.

📱 FONCTIONNALITÉS TERRAIN
• Scanner QR codes : Identifiez instantanément vos équipements et machines.
• Mode hors-ligne : Continuez vos interventions sans réseau, synchronisation automatique en tâche de fond.
• Création de tickets : Capture de photos, géolocalisation et diagnostic en 30 secondes.
• Work Orders : Checklists interactives, gammes de maintenance et signature client.
• Notifications push : Alertes en temps réel sur les urgences et assignations.
• Biométrie sécurisée : Déverrouillage par Face ID / Touch ID.

📊 FONCTIONNALITÉS BUSINESS & CAFM
• Multi-organisations & Multi-sites : Pilotez l'ensemble de votre parc immobilier et industriel.
• RBAC strict : 4 niveaux de permissions (Admin, Manager, Technician, Viewer).
• Analytics avancés : Calcul en direct des MTBF, MTTR, OEE et empreinte carbone.
• Assistant IA : Diagnostic conversationnel assisté par Google Gemini.

🔒 SÉCURITÉ & CONFORMITÉ
• Chiffrement de bout en bout (AES-256 / TLS 1.3).
• Double authentification (2FA TOTP) & stockage sécurisé des clés (SecureStore / Keychain).
• Conformité RGPD complète.
```

---

## 🤖 Google Play Store (Android)

| Champ | Contenu | Limite |
|---|---|---|
| **Nom de l'app** | BeeCarbonIT | 30 car. |
| **Description courte** | GMAO intelligente et maintenance terrain pour équipes industrielles | 80 car. |
| **Package Name** | `io.beecarbonit.mobile` | - |
| **Catégorie** | Entreprise / Outils de productivité | - |
| **Email de contact** | `support@beecarbonit.com` | - |
| **URL de confidentialité** | `https://beecarbonit.com/privacy` | - |

---

## 🎨 Spécifications des Assets Visuels

### 1. App Icon
- **iOS** : `1024 x 1024 px` (PNG sans canal alpha / sans transparence).
- **Android Foreground** : `512 x 512 px` (PNG avec fond transparent).
- **Android Background** : `#000000` (Fond noir pur).

### 2. Splash Screen
- **Format** : `1284 x 2778 px` (iPhone 14/15 Pro Max) et `1080 x 1920 px` (Android).
- **Fond** : `#000000`.

### 3. Screenshots Requis
- **iPhone 6.7"** : `1290 x 2796 px` (5 captures minimum).
- **iPhone 6.1"** : `1179 x 2556 px` (5 captures recommandées).
- **Google Play** : `1080 x 1920 px` ou `1440 x 2560 px` (min 2, max 8).
- **Feature Graphic Google Play** : `1024 x 500 px` (Bannière d'en-tête Play Store).

---

## 🛡️ Données Collectées & Data Safety Form (Google Play)

* **Identifiants** : Adresse email et nom d'utilisateur (Création et synchronisation de compte).
* **Localisation** : Coordonnées GPS précises / approximatives (Géolocalisation des tickets et interventions).
* **Photos & Vidéos** : Photos d'équipements et d'anomalies (Uniquement à l'initiative du technicien).
* **Activité & Diagnostic** : Logs d'erreurs et crash reports via Sentry (Chiffrés et anonymisés).
* **Chiffrement** : Toutes les données sont chiffrées en transit (HTTPS) et au repos.
