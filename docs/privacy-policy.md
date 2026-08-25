# 🔒 Politique de Confidentialité — BeeCarbonIT

*Dernière mise à jour : 25 Août 2026*

La présente politique de confidentialité décrit la façon dont **BeeCarbonIT** (« nous », « notre » ou « l'Application ») collecte, utilise et protège les données des utilisateurs de nos applications web et mobiles (iOS et Android).

---

## 1. Données Collectées

Dans le cadre de l'exploitation de la plateforme GMAO / CAFM, nous pouvons collecter :
- **Informations de compte** : Adresse e-mail professionnelle, prénom, nom, rôle organisationnel.
- **Données d'intervention** : Descriptifs de pannes, commentaires de maintenance, historiques de tickets.
- **Photos et médias** : Photographies prises lors de la création d'un ticket ou de la clôture d'un ordre de travail.
- **Données de localisation** : Coordonnées GPS capturées lors du signalement d'un incident terrain (uniquement avec le consentement explicite de l'utilisateur).
- **Données techniques et de diagnostic** : Rapports de crash et métriques de performances (via Sentry, anonymisés).

---

## 2. Finalités du Traitement

Les données collectées sont utilisées exclusivement pour :
1. Assurer la gestion, l'affectation et le suivi des ordres de travail et des tickets.
2. Permettre la synchronisation hors-ligne et en direct des interventions techniques.
3. Calculer les indicateurs industriels de performance (MTBF, MTTR, OEE).
4. Assurer la sécurité et l'intégrité des accès (authentification 2FA et biométrique locale).

---

## 3. Stockage et Sécurité des Données

- **Chiffrement en transit** : Tous les échanges entre l'application mobile, le web et les serveurs utilisent le protocole TLS 1.3 / HTTPS.
- **Chiffrement local** : Les jetons d'authentification et clés de session sont stockés dans le trousseau sécurisé du terminal (iOS Keychain / Android Keystore via Expo SecureStore).
- **Hébergement** : Les bases de données sont hébergées sur des infrastructures sécurisées et conformes aux normes ISO 27001 et RGPD.

---

## 4. Partage avec des Tiers

Nous ne vendons ni ne louons vos données personnelles à des tiers. Les partages sont strictement limités aux services techniques d'infrastructure :
- **Google Gemini API** : Pour le traitement des requêtes d'assistance intelligente et la classification automatique de tickets (données anonymisées).
- **Sentry** : Pour le suivi et la résolution des erreurs applicatives.
- **Stripe** : Pour la gestion sécurisée de la facturation et des abonnements SaaS.

---

## 5. Vos Droits (RGPD)

Conformément à la réglementation européenne sur la protection des données (RGPD), vous disposez des droits suivants :
- Droit d'accès et de rectification de vos données personnelles.
- Droit à l'effacement (« droit à l'oubli »).
- Droit à la limitation et à l'opposition au traitement.
- Droit à la portabilité de vos données.

Pour exercer ces droits, vous pouvez contacter notre délégué à la protection des données :  
📧 **Email** : `privacy@beecarbonit.com`
