# Politique de Confidentialité & Protection des Données (RGPD / GDPR)

**Date d'entrée en vigueur :** 31 Août 2026  
**Dernière mise à jour :** 31 Août 2026  
**Responsable du Traitement :** BeeCarbonIT SAS  

---

## 1. Données Traitées
BeeCarbonIT collecte et traite des données dans le cadre exclusif de la gestion technique de bâtiment (GMAO / EAM) et du suivi ESG / Carbone :
- **Données d'Utilisateurs / Techniciens :** Nom, prénom, adresse e-mail professionnelle, rôle RBAC, identifiant unique.
- **Données Télémétriques & Métrologiques :** Consommations énergétiques (kWh, m³ eau, gaz), flux de déchets, capteurs IoT environnementaux (CO2, température, humidité).
- **Données Patrimoniales :** Inventaire des équipements, plans d'espaces, bons d'intervention et historique de maintenance.

## 2. Base Légale et Finalités
- **Exécution du contrat (Art. 6.1.b RGPD) :** Fourniture des services SaaS d'hypervision, GMAO et reporting carbone.
- **Obligation légale (Art. 6.1.c RGPD) :** Conformité aux réglementations CSRD (Scopes 1-2-3) et Décret Tertiaire.
- **Intérêt légitime (Art. 6.1.f RGPD) :** Sécurité de la plateforme, prévention de la fraude et audit de traçabilité.

## 3. Propriété et Localisation des Données
- **Propriété exclusive :** L'ensemble des données immobilières, de maintenance et de comptabilité carbone demeure la propriété pleine et entière du **Client / Tenant**.
- **Hébergement :** Toutes les bases de données primaires et sauvegardes sont hébergées au sein de l'Union Européenne (Région France / Allemagne) en conformité stricte avec le RGPD.

## 4. Droits des Personnes Concernées (Articles 15 à 22 RGPD)
Chaque utilisateur dispose des droits suivants :
- **Droit d'accès et de portabilité (Export JSON/CSV) :** Endpoint API dédié `GET /api/gdpr/export`.
- **Droit à la rectification :** Mise à jour immédiate via le profil utilisateur ou l'administration du tenant.
- **Droit à l'effacement (« Droit à l'oubli ») :** Endpoint API dédié `DELETE /api/gdpr/delete`.

Pour exercer ces droits : `dpo@beecarbonit.com` ou via les réglages du compte.
