# Guide d'Harmonisation du Code - ReclamTrack

## 🎯 Objectif

Ce guide vous accompagne dans la mise en place et l'utilisation des outils de qualité de code pour ReclamTrack.

---

## 📦 Étape 1 : Installer les Extensions VS Code

Lorsque vous ouvrez le projet dans VS Code, une notification apparaîtra pour installer les extensions recommandées.

### Extensions Installées

1. **Code Spell Checker** (`streetsidesoftware.code-spell-checker`)
   - ✅ Vérifie l'orthographe en anglais et français
   - 🔧 Souligne les fautes en jaune

2. **Import Cost** (`wix.vscode-import-cost`)
   - ✅ Affiche la taille des imports en ligne
   - 🔧 Aide à optimiser la taille du bundle

3. **Auto Rename Tag** (`formulahendry.auto-rename-tag`)
   - ✅ Renomme automatiquement les balises HTML/JSX
   - 🔧 Gagne du temps sur les composants React

4. **Better Comments** (`aaron-bond.better-comments`)
   - ✅ Colore les commentaires selon leur type
   - 🔧 Utilise `!`, `?`, `TODO`, `//`, `*`

5. **Error Lens** (`usernamehw.errorlens`)
   - ✅ Affiche les erreurs directement dans le code
   - 🔧 Pas besoin d'ouvrir le panel des problèmes

6. **Prettier** (`esbenp.prettier-vscode`)  
   - ✅ Formate automatiquement le code
   - 🔧 Fonctionne à la sauvegarde

7. **ESLint** (`dbaeumer.vscode-eslint`)
   - ✅ Détecte les erreurs de code
   - 🔧 Auto-fix à la sauvegarde

### Installation Manuelle

Si la notification n'apparaît pas :

```plaintext
1. Ouvrir la palette de commandes (Ctrl+Shift+P)
2. Taper "Extensions: Show Recommended Extensions"
3. Cliquer sur "Install All"
```

---

## ⚙️ Étape 2 : Comprendre les Configurations

### EditorConfig (`.editorconfig`)

Assure la cohérence entre tous les éditeurs :
- **Indentation** : 2 espaces
- **End of line** : LF (Unix)
- **Charset** : UTF-8
- **Trailing spaces** : Supprimés automatiquement

### ESLint

#### Frontend (`frontend/.eslintrc.json`)
- Extends : `next/core-web-vitals`, `next/typescript`, `prettier`
- Règles :
  - Variables non utilisées : **warning**
  - `any` explicite : **warning**
  - `console.log` : **warning** (mais `console.warn` et `console.error` autorisés)
  - React hooks dependencies : **warning**

#### Backend (`backend/.eslintrc.json`)
- Extends : `eslint:recommended`, `@typescript-eslint/recommended`, `prettier`
- Règles :
  - Variables non utilisées : **warning**
  - `any` explicite : **warning**
  - `console` : **autorisé** (normal pour un backend)
  - `prefer-const` : **warning**

### Prettier

#### Frontend (`frontend/.prettierrc.json`)
```json
{
  "semi": true,              // Point-virgules requis
  "trailingComma": "es5",    // Virgules trailing ES5
  "singleQuote": false,      // Double quotes (JSX)
  "printWidth": 100,         // Largeur max : 100 caractères
  "tabWidth": 2,             // 2 espaces
  "plugins": ["prettier-plugin-tailwindcss"]  // Tri des classes Tailwind
}
```

#### Backend (`backend/.prettierrc.json`)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,       // Single quotes (Node.js convention)
  "printWidth": 100,
  "tabWidth": 2
}
```

### VS Code Settings (`.vscode/settings.json`)

- **Format on save** : ✅ Activé
- **Format on paste** : ✅ Activé
- **ESLint auto-fix on save** : ✅ Activé
- **Organize imports on save** : ✅ Activé
- **Trim trailing whitespace** : ✅ Activé
- **Insert final newline** : ✅ Activé

---

## 🚀 Étape 3 : Utiliser les Outils

### Formater le Code

#### Automatiquement (recommandé)
Le code est automatiquement formaté à chaque sauvegarde grâce à Prettier.

#### Manuellement
```powershell
# Frontend
cd frontend
npm run format

# Backend
cd backend
npx prettier --write .
```

### Vérifier le Linting

#### Automatiquement
ESLint s'exécute en temps réel et affiche les erreurs dans le code grâce à Error Lens.

#### Manuellement
```powershell
# Frontend
cd frontend
npm run lint
npm run lint:fix  # Auto-fix

# Backend
cd backend
npm run lint
```

### Vérifier les Types TypeScript

```powershell
# Frontend
cd frontend
npm run type-check

# Backend
cd backend
npm run build
```

### Exécuter Tous les Checks

```powershell
# Depuis la racine
npm run lint    # Lint frontend + backend
npm run test    # Tests frontend + backend
npm run build   # Build frontend + backend
```

---

## 🎨 Étape 4 : Utiliser Better Comments

Better Comments colore vos commentaires selon leur type :

### Types de Commentaires

```typescript
// ! ALERT : Attention danger !
// ? QUESTION : Pourquoi cela fonctionne-t-il ?
// TODO : À faire plus tard
// * HIGHLIGHT : Information importante
// // STRIKETHROUGH : Code déprécié
```

### Couleurs
- `!` : **Rouge** (#FF2D00) - Alerte
- `?` : **Bleu** (#3498DB) - Question
- `TODO` : **Orange** (#FF8C00) - À faire
- `*` : **Vert** (#98C379) - Important
- `//` : **Gris barré** (#474747) - Déprécié

---

## 📊 Étape 5 : Comprendre Error Lens

Error Lens affiche les erreurs **directement dans le code** au lieu du panneau "Problèmes".

### Avantages
- ✅ Vision instantanée des erreurs
- ✅ Pas besoin de changer de panel
- ✅ Correction plus rapide

### Configuration
```json
{
  "errorLens.enabled": true,
  "errorLens.fontSize": "12px",
  "errorLens.padding": "2px"
}
```

---

## 🔍 Étape 6 : Comprendre Import Cost

Import Cost affiche la **taille des imports** directement dans le code.

### Exemple
```typescript
import React from "react";  // 👈 "6.5KB (gzipped: 2.5KB)"
import lodash from "lodash";  // 👈 "72.5KB (gzipped: 25KB)" ⚠️ GROS !
```

### Utilisation
- ✅ Identifie les imports lourds
- ✅ Optimise la taille du bundle
- ✅ Utilise le code splitting si nécessaire

---

## ✅ Étape 7 : Vérifier le Spell Checker

Code Spell Checker vérifie l'orthographe en **anglais et français**.

### Ajouter des Mots au Dictionnaire

1. Clic droit sur le mot souligné
2. Choisir "Add to workspace settings"

### Langues Supportées
- `en` : Anglais
- `fr` : Français

---

## 🎯 Étape 8 : Workflow Recommandé

### Avant de Commiter

```powershell
# 1. Formater le code
cd frontend && npm run format
cd ../backend && npx prettier --write .

# 2. Vérifier le linting
npm run lint

# 3. Vérifier les types
cd frontend && npm run type-check
cd ../backend && npm run build

# 4. Lancer les tests
npm run test
```

### Pendant le Développement

1. **Écrire le code** normalement
2. **Sauvegarder** (Ctrl+S) → Auto-formattage + Auto-fix ESLint
3. **Vérifier Error Lens** pour les erreurs inline
4. **Vérifier Import Cost** pour optimiser les imports

---

## 📝 Étape 9 : Résoudre les TODOs

### TODOs Identifiés (5)

1. **`backend/src/routes/billing.ts:110`**
   ```typescript
   // TODO: Provision subscription, update user role/org status
   ```

2. **`backend/src/routes/knowledge.ts:58`**
   ```typescript
   // TODO: Vérifier permissions admin/manager
   ```

3. **`backend/src/routes/members.ts:123`**
   ```typescript
   // TODO: Send email invitation via nodemailer
   ```

4. **`backend/src/routes/messages.ts:19`**
   ```typescript
   // TODO: Ajouter logique pour les groupes d'équipe
   ```

5. **`backend/src/routes/memberships.ts:113`**
   ```typescript
   // TODO: Send invitation email
   ```

### Chercher les TODOs

```powershell
# Chercher tous les TODOs dans le projet
grep -r "TODO" frontend/src backend/src

# Ou utiliser VS Code
Ctrl+Shift+F → Rechercher "TODO"
```

---

## 🔧 Étape 10 : Améliorations Futures

### Priorité Haute
- [ ] Résoudre les 5 TODOs backend
- [ ] Ajouter Husky pour pre-commit hooks
- [ ] Configurer commitlint pour messages standardisés

### Priorité Moyenne
- [ ] Ajouter des tests unitaires manquants
- [ ] Créer un CHANGELOG.md
- [ ] Documenter l'API avec Swagger

### Priorité Basse
- [ ] Configurer Storybook pour les composants
- [ ] Ajouter Bundle Analyzer
- [ ] Tests E2E avec Playwright

---

## 📚 Ressources

### Documentation Officielle
- [ESLint](https://eslint.org/docs/latest/)
- [Prettier](https://prettier.io/docs/en/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [EditorConfig](https://editorconfig.org/)

### Extensions VS Code
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

---

## 🎉 Conclusion

Vous avez maintenant tous les outils pour maintenir un code de **haute qualité** dans ReclamTrack !

**Prochaine étape** : Installez les extensions VS Code et commencez à coder ! 🚀
