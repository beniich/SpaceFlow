# ADR-0006 : Application Mobile Native avec Expo

## Statut
Accepté — 2026-08-25

## Contexte
Les techniciens de maintenance et opérateurs terrain ont besoin d'accéder à BeeCarbonIT depuis leurs smartphones et tablettes, avec un mode hors-ligne résilient et un accès direct aux périphériques matériels (caméra QR, géolocalisation GPS, biométrie).

## Décision
Utiliser **Expo (React Native)** plutôt que :
- ❌ **Natif pur (Swift/Kotlin)** : doublement de la surface de code et compétences distinctes requises.
- ❌ **PWA seule** : limitations de synchronisation en arrière-plan et accès matériel restreint sur iOS.
- ❌ **Flutter** : écosystème Dart distinct de notre codebase TypeScript unifiée.

## Conséquences

### ✅ Positives
- **Partage de code & types** : Réutilisation des modèles TypeScript, types et endpoints API existants.
- **Cycle de release simplifié** : Déploiement et Over-The-Air (OTA) updates via Expo EAS.
- **Accès matériel complet** : Caméra pour scanner QR, biométrie (Face ID / Empreinte), GPS et notifications push.
- **Mode hors-ligne** : File d'attente persistante MMKV (`offlineQueue.service.ts`) avec synchronisation automatique.

### ⚠️ Négatives
- Dépendance à l'écosystème Expo et configuration EAS Build requise pour la production.
