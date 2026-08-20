# Code Quality & Linting Report

## 1. Backend Linting
- **Configuration**: Uses `.eslintrc` (legacy format) with ESLint 8.57.0 (from `package.json`).
- **Issues**: ESLint is configured to run via `npm run lint` (`eslint src/`). The backend should migrate to `eslint.config.js` or fix the configuration if upgrading to ESLint 9+.

## 2. Frontend Linting
- **Configuration**: Uses `.eslintrc.json` (legacy format).
- **Issues**: 
  - There is no `lint` script in `frontend/package.json`.
  - When running `npx eslint src/`, it fails because it uses ESLint v10 default behavior which strictly requires `eslint.config.js`. The project must be updated to use the new flat config or run with `ESLINT_USE_FLAT_CONFIG=false`.

## 3. General Observations
- The codebase uses Prettier (`.prettierignore`, `.prettierrc.json`) which is good for consistent formatting.
- `package.json` at root is missing a centralized linting script to run both frontend and backend checks.

### Recommendations
1. Add `"lint": "eslint src/"` to `frontend/package.json`.
2. Migrate both frontend and backend to ESLint Flat Config (`eslint.config.js`).
3. Add a root lint script (e.g. `"lint": "concurrently \"npm run lint --workspace=frontend\" \"npm run lint --workspace=backend\""`).
