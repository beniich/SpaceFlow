# CI/CD Pipeline Audit

## Overview
The project uses GitHub Actions for its CI/CD pipeline, defined in `.github/workflows`. There are three main workflows:
1. `ci.yml`: Quality gate for PRs and pushes.
2. `deploy-vercel.yml`: Handles tests and deployment to Vercel (Preview and Production).
3. `security.yml`: Runs dependency audits and secret scanning (gitleaks).

## 1. `ci.yml` (Quality Gate)
- **Strengths**: 
  - Uses `bun` which aligns with the lockfile found in the repository.
  - Builds the frontend and runs backend Prisma generate.
  - Caches artifacts using `actions/upload-artifact`.
- **Weaknesses**: 
  - The lint job uses `bun run lint --if-present` on the frontend, but we know the frontend lacks this script, so linting effectively doesn't run.
  - Backend tests aren't explicitly run in this workflow (they are in the deploy workflow).
  - Uses `node --check src/server.js` which is basic.

## 2. `deploy-vercel.yml` (Vercel Deployment)
- **Strengths**: 
  - Sets up a real PostgreSQL service via Docker for testing.
  - Generates Prisma client, deploys migrations, and runs seeding before running backend tests (`npm test --if-present`).
  - Implements Preview deployments for PRs and Production deployments for main branch pushes.
- **Weaknesses**: 
  - Uses `npm ci` but the repository primarily uses `bun.lock`. This can lead to inconsistencies or fail if `package-lock.json` is not committed. As observed earlier, `package-lock.json` might be missing.

## 3. `security.yml` (Security Audit)
- **Strengths**: 
  - Runs on a schedule and on package changes.
  - Uses `gitleaks` for secret scanning (very good practice).
  - Uses `actions/dependency-review-action` for PRs.
- **Weaknesses**: 
  - Uses `npm audit` after running `bun install`. Since `bun install` does not generate `package-lock.json` by default, `npm audit` will fail (as tested manually). It should either use `bun audit` or ensure lockfiles are present.

### Recommendations
1. **Unify Package Manager in CI**: The workflows mix `bun install` and `npm ci`. If `bun` is the standard, use `bun install` and `bun test` everywhere. If `npm` is the standard, use `npm ci` everywhere and remove `bun.lock`.
2. **Fix Security Audit**: Change `npm audit` to `bun audit` in `security.yml` if staying with bun.
3. **Fix Linting**: Ensure `lint` scripts are defined in `package.json` for frontend and backend, and remove `continue-on-error: true` in the lint job once issues are fixed.
