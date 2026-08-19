# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leases.spec.ts >> Leases Management >> should create lease successfully
- Location: e2e/leases.spec.ts:32:3

# Error details

```
TimeoutError: page.fill: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="Loyer"]')

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - generic [ref=f1e5]:
      - heading "BEECARBONAT" [level=1] [ref=f1e15]
      - generic [ref=f1e16]:
        - generic [ref=f1e17]: Online
        - button "Sync" [ref=f1e22] [cursor=pointer]
    - navigation [ref=f1e25]:
      - link "Dashboard" [ref=f1e26] [cursor=pointer]:
        - /url: /dashboard
      - link "Executive View" [ref=f1e32] [cursor=pointer]:
        - /url: /executive
      - link "Strategic Roadmap" [ref=f1e36] [cursor=pointer]:
        - /url: /roadmap
      - link "Assets" [ref=f1e39] [cursor=pointer]:
        - /url: /assets
      - link "QR Code Scanner" [ref=f1e44] [cursor=pointer]:
        - /url: /scanner
      - link "Spaces" [ref=f1e51] [cursor=pointer]:
        - /url: /spaces
      - link "Work Orders" [ref=f1e55] [cursor=pointer]:
        - /url: /work-orders
      - link "Maintenance" [ref=f1e59] [cursor=pointer]:
        - /url: /maintenance
      - link "Team Operations" [ref=f1e62] [cursor=pointer]:
        - /url: /team
      - paragraph [ref=f1e69]: 5 Strategic Pillars
      - link "FieldTech Mobile & OT" [ref=f1e70] [cursor=pointer]:
        - /url: /intervention
      - link "Energy & ESG Copilot" [ref=f1e75] [cursor=pointer]:
        - /url: /energy
      - link "BIM & 3D Viewer" [ref=f1e79] [cursor=pointer]:
        - /url: /bim
      - link "Digital Twin" [ref=f1e85] [cursor=pointer]:
        - /url: /digital-twin
      - link "Predictive AI & Health" [ref=f1e90] [cursor=pointer]:
        - /url: /predictive-maintenance
      - link "Occupants & Tenant Care" [ref=f1e94] [cursor=pointer]:
        - /url: /tenants
      - paragraph [ref=f1e100]: Modules & System
      - link "CMMS / BEECARBONAT" [ref=f1e101] [cursor=pointer]:
        - /url: /cmms
      - link "ERP Integration" [ref=f1e104] [cursor=pointer]:
        - /url: /erp
      - link "Analytics" [ref=f1e109] [cursor=pointer]:
        - /url: /analytics
      - link "Leases & Contracts" [ref=f1e112] [cursor=pointer]:
        - /url: /leases
      - link "PDF Exports & Reports" [ref=f1e116] [cursor=pointer]:
        - /url: /exports
      - link "Notifications & Alerts" [ref=f1e120] [cursor=pointer]:
        - /url: /notifications
      - link "Generative AI Assistant" [ref=f1e124] [cursor=pointer]:
        - /url: /ai
      - link "Security & Access" [ref=f1e128] [cursor=pointer]:
        - /url: /security
      - link "System Configuration" [ref=f1e131] [cursor=pointer]:
        - /url: /settings
    - generic [ref=f1e135]:
      - generic [ref=f1e136]:
        - generic [ref=f1e137]: TB
        - generic [ref=f1e139]:
          - paragraph [ref=f1e140]: Tarik Benaich
          - paragraph [ref=f1e141]: ADMIN
      - button "Logout" [ref=f1e142] [cursor=pointer]
  - main [ref=f1e147]:
    - generic [ref=f1e148]:
      - generic [ref=f1e149]:
        - generic [ref=f1e150]:
          - generic [ref=f1e151]:
            - heading "BAUX & LOCATAIRES" [level=1] [ref=f1e152]
            - paragraph [ref=f1e158]: Supervision des occupations • ESG Scope 3 (Cat 13)
          - generic [ref=f1e160]:
            - button "Export CSRD Locataires" [ref=f1e161] [cursor=pointer]
            - button "Nouveau Bail" [ref=f1e165] [cursor=pointer]
        - generic [ref=f1e167]:
          - generic [ref=f1e168]:
            - generic [ref=f1e173]: Surface Totale Louée (GLA)
            - generic [ref=f1e174]:
              - generic [ref=f1e175]: 4,950
              - generic [ref=f1e176]: m²
          - generic [ref=f1e177]:
            - generic [ref=f1e182]: Empreinte Scope 3 (Cat 13)
            - generic [ref=f1e183]:
              - generic [ref=f1e184]: "206.5"
              - generic [ref=f1e185]: tCO₂e
          - generic [ref=f1e187]:
            - generic [ref=f1e191]: Renouvellements < 12 mois
            - generic [ref=f1e192]:
              - generic [ref=f1e193]: "1"
              - generic [ref=f1e194]: baux
        - generic [ref=f1e195]:
          - heading "Registre des Locataires" [level=3] [ref=f1e197]
          - generic [ref=f1e202]:
            - generic [ref=f1e203]:
              - generic [ref=f1e207]:
                - generic [ref=f1e208]:
                  - generic [ref=f1e209]:
                    - generic [ref=f1e210]: LSE-001
                    - generic [ref=f1e211]: Tertiaire
                  - heading "TechCorp Europe" [level=3] [ref=f1e212]
                - generic [ref=f1e213]:
                  - button [ref=f1e214] [cursor=pointer]
                  - button [ref=f1e218] [cursor=pointer]
              - generic [ref=f1e222]:
                - generic [ref=f1e223]:
                  - generic [ref=f1e224]: Surface (GLA)
                  - generic [ref=f1e225]: 1,200 m²
                - generic [ref=f1e226]:
                  - generic [ref=f1e227]: Fin de bail
                  - generic [ref=f1e228]: déc. 2026Bientôt
              - generic [ref=f1e230]:
                - generic [ref=f1e231]: Estimateur Aval (Cat 13)
                - generic [ref=f1e235]: 42.5 tCO₂e
            - generic [ref=f1e238]:
              - generic [ref=f1e239]:
                - generic [ref=f1e240]:
                  - generic [ref=f1e241]:
                    - generic [ref=f1e242]: LSE-002
                    - generic [ref=f1e243]: Retail
                  - heading "Boutique Éphémère (Pop-up)" [level=3] [ref=f1e244]
                - generic [ref=f1e245]:
                  - button [ref=f1e246] [cursor=pointer]
                  - button [ref=f1e250] [cursor=pointer]
              - generic [ref=f1e254]:
                - generic [ref=f1e255]:
                  - generic [ref=f1e256]: Surface (GLA)
                  - generic [ref=f1e257]: 250 m²
                - generic [ref=f1e258]:
                  - generic [ref=f1e259]: Fin de bail
                  - text: mai 2026
              - generic [ref=f1e261]:
                - generic [ref=f1e262]: Estimateur Aval (Cat 13)
                - generic [ref=f1e266]: 18.2 tCO₂e
            - generic [ref=f1e269]:
              - generic [ref=f1e270]:
                - generic [ref=f1e271]:
                  - generic [ref=f1e272]:
                    - generic [ref=f1e273]: LSE-003
                    - generic [ref=f1e274]: Data Center / Tertiaire
                  - heading "DataTech Analytics" [level=3] [ref=f1e275]
                - generic [ref=f1e276]:
                  - button [ref=f1e277] [cursor=pointer]
                  - button [ref=f1e281] [cursor=pointer]
              - generic [ref=f1e285]:
                - generic [ref=f1e286]:
                  - generic [ref=f1e287]: Surface (GLA)
                  - generic [ref=f1e288]: 3,500 m²
                - generic [ref=f1e289]:
                  - generic [ref=f1e290]: Fin de bail
                  - text: févr. 2029
              - generic [ref=f1e292]:
                - generic [ref=f1e293]: Estimateur Aval (Cat 13)
                - generic [ref=f1e297]: 145.8 tCO₂e
      - generic [ref=f1e302]:
        - heading "Nouveau bail" [level=2] [ref=f1e304]
        - generic [ref=f1e306]:
          - generic [ref=f1e307]:
            - generic [ref=f1e308]: Locataire (Entité légale)
            - textbox "Nom du Locataire" [ref=f1e309]: Test Tenant 1787145543546
          - generic [ref=f1e310]:
            - generic [ref=f1e311]:
              - generic [ref=f1e312]: Bâtiment / Site
              - combobox [ref=f1e313]:
                - option "Sélectionner..." [selected]
            - generic [ref=f1e314]:
              - generic [ref=f1e315]: Surface (m²)
              - spinbutton "GLA en m²" [ref=f1e316]: "0"
          - generic [ref=f1e317]:
            - generic [ref=f1e318]:
              - generic [ref=f1e319]: Début du bail
              - textbox [ref=f1e320]: 2025-01-01
            - generic [ref=f1e321]:
              - generic [ref=f1e322]: Fin de bail
              - textbox [active] [ref=f1e323]: 2026-12-31
        - generic [ref=f1e324]:
          - button "Annuler" [ref=f1e325] [cursor=pointer]
          - button "Enregistrer" [ref=f1e326] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Leases Management', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.fill('input[type="email"]', 'admin@cafm.com');
  7  |     await page.fill('input[type="password"]', 'admin123');
  8  |     await page.click('button[type="submit"]');
  9  |     await page.waitForURL('/');
  10 |     await page.goto('/leases');
  11 |     await page.waitForLoadState('networkidle');
  12 |   });
  13 | 
  14 |   test('should display leases page', async ({ page }) => {
  15 |     await expect(page.locator('h1')).toContainText(/Baux/i);
  16 |     await expect(page.locator('button:has-text("Nouveau bail")')).toBeVisible();
  17 |   });
  18 | 
  19 |   test('should open creation modal', async ({ page }) => {
  20 |     await page.click('button:has-text("Nouveau bail")');
  21 |     await expect(page.locator('h2:has-text("Nouveau bail")')).toBeVisible();
  22 |     await expect(page.locator('input[placeholder*="Locataire"]')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('should validate required fields', async ({ page }) => {
  26 |     await page.click('button:has-text("Nouveau bail")');
  27 |     await page.click('button[type="submit"]');
  28 |     const input = page.locator('input[placeholder*="Locataire"]');
  29 |     await expect(input).toHaveAttribute('required');
  30 |   });
  31 | 
  32 |   test('should create lease successfully', async ({ page }) => {
  33 |     await page.click('button:has-text("Nouveau bail")');
  34 |     const tenantName = `Test Tenant ${Date.now()}`;
  35 |     await page.fill('input[placeholder*="Locataire"]', tenantName);
  36 |     await page.fill('input[type="date"] >> nth=0', '2025-01-01');
  37 |     await page.fill('input[type="date"] >> nth=1', '2026-12-31');
> 38 |     await page.fill('input[placeholder*="Loyer"]', '5000');
     |                ^ TimeoutError: page.fill: Timeout 10000ms exceeded.
  39 |     await page.click('button[type="submit"]');
  40 |     await expect(page.locator('text=Bail créé')).toBeVisible({ timeout: 5000 });
  41 |     await expect(page.locator(`text=${tenantName}`)).toBeVisible();
  42 |   });
  43 | 
  44 |   test('should close modal on cancel', async ({ page }) => {
  45 |     await page.click('button:has-text("Nouveau bail")');
  46 |     await expect(page.locator('h2:has-text("Nouveau bail")')).toBeVisible();
  47 |     await page.click('button:has-text("Annuler")');
  48 |     await expect(page.locator('h2:has-text("Nouveau bail")')).not.toBeVisible();
  49 |   });
  50 | });
  51 | 
```