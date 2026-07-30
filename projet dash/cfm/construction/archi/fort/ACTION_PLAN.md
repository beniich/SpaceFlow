# 🎯 Plan d'Action Concret - Harmonisation des 39 Pages

## 📅 Timeline Détaillée (12 Semaines)

### Semaine 1-2: Setup & Foundation

#### Jour 1-2: Configuration Projet

- [x] Initialiser structure Next.js App Router
- [x] Configurer Tailwind avec design tokens
- [x] Installer dépendances (Zustand, React Query, Leaflet, etc.)
- [x] Configurer ESLint, Prettier, TypeScript strict
- [x] Setup Git hooks (Husky + lint-staged)

#### Jour 3-5: Design System

- [x] Créer fichier `design-tokens.css`
- [x] Configurer `tailwind.config.js` avec tokens
- [x] Créer composants UI de base (Button, Card, Badge, Input)
- [x] Documenter composants dans Storybook (optionnel)

#### Jour 6-10: Composants Layout

- [x] Extraire et créer `Header.tsx`
- [x] Extraire et créer `Sidebar.tsx`
- [x] Extraire et créer `Footer.tsx`
- [x] Créer `MobileNav.tsx`
- [x] Créer layouts Next.js (RootLayout, DashboardLayout, AuthLayout)

---

### Semaine 3-4: Pages Core

#### Jour 11-13: Authentification

- [x] Migrer `secure_login_screen` → `/login`
- [x] Implémenter authStore (Zustand)
- [x] Connecter API backend `/api/auth/login`
- [x] Protected routes middleware
- [x] Session persistence (localStorage + cookies)

#### Jour 14-16: Dashboard Principal

- [x] Migrer `operations_management_dashboard` → `/dashboard/operations`
- [x] Créer composants KPICard, StatCard
- [x] Implémenter fetching données temps réel
- [x] Ajouter filtres date range

#### Jour 17-20: Gestion Réclamations

- [x] Migrer `advanced_complaint_list_view` → `/complaints/list`
- [x] Créer DataTable component réutilisable
- [x] Implémenter pagination, tri, filtres
- [x] Migrer `detailed_complaint_ticket_view` → `/complaints/[id]`
- [x] Connecter API CRUD complaints

---

### Semaine 5-6: Formulaires & Maps

#### Jour 21-25: Formulaire Multi-étapes

- [x] Migrer `step-by-step_complaint_intake_form` → `/complaints/create`
- [x] Implémenter stepper component
- [x] Validation Zod pour chaque étape
- [x] State management formulaire (React Hook Form)
- [x] Upload fichiers (photos, documents)

#### Jour 26-30: Cartographie

- [x] Intégrer Leaflet dans projet
- [x] Créer MapView component
- [x] Migrer `geospatial_operations_map` → `/map` (Live Data connected)
- [x] Clustering markers pour performance
- [x] Géolocalisation utilisateur

---

### Semaine 7-8: Équipes & Planning

#### Jour 31-35: Gestion Équipes

- [x] Migrer `technical_teams_directory` → `/teams/directory`
- [x] Migrer `technical_team_profile_details` → `/teams/[id]`
- [x] Créer TeamCard, TeamMemberList components
- [x] API endpoints teams CRUD

#### Jour 36-40: Planning & Calendrier

- [x] Migrer `intervention_planning_calendar` → `/planning` (Live Data connected)
- [x] Intégrer FullCalendar ou React Big Calendar
- [x] Drag & drop interventions (Live updates)
- [x] Migrer `team_shift_&_roster_scheduler`
- [x] Gestion conflits horaires (Backend validated)

---

### Semaine 9-10: Inventaire & Admin

#### Jour 41-45: Gestion Stocks

- [x] Migrer `inventory_&_stock_management_1` → `/inventory/stock`
- [x] Migrer `material_requisition_form` → `/inventory/request` (Live submission)
- [x] Migrer `warehouse_request_approval_portal` → `/inventory/approval`
- [x] Workflow approbation (états: pending → approved → delivered)
- [x] Notifications temps réel (Socket.io)

#### Jour 46-50: Administration

- [x] Migrer `system_admin_overview` → `/admin/system`
- [x] Migrer `user_&_roles_management` → `/admin/users`
- [x] Migrer `audit_logs_&_activity_feed` → `/admin/audit-logs`
- [x] RBAC (Role-Based Access Control)
- [x] Logs en temps réel (WebSocket)

---

### Semaine 11-12: Analytics & Finalisation

#### Jour 51-55: Dashboards Analytics

- [x] Migrer `operational_analytics_dashboard` → `/analytics` (Live Charts connected)
- [x] Migrer `citizen_satisfaction_dashboard` → `/analytics/satisfaction`
- [x] Intégrer Chart.js ou Recharts
- [x] Export données (Excel, CSV, PDF)
- [x] Migrer `reporting_&_data_archiving`

#### Jour 56-60: Pages Restantes

- [x] Migrer toutes les pages secondaires
- [x] Interface mobile technicien
- [x] Portail citoyen
- [x] Pages e-commerce (abonnements)
- [x] Signature digitale

#### Jour 61-65: Tests & Optimisation

- [x] Tests unitaires (Jest + React Testing Library)
- [x] Tests E2E (Playwright)
- [x] Optimisation performance (Lighthouse > 90)
- [x] Accessibilité (WCAG 2.1 AA)
- [x] Documentation finale

---

## 🧩 Templates de Composants Réutilisables

### 1. Header Component

```tsx
// components/layout/Header.tsx
"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Bell, Search, Settings, User } from "lucide-react";

interface HeaderProps {
  showSearch?: boolean;
  breadcrumbs?: { label: string; href: string }[];
}

export function Header({ showSearch = true, breadcrumbs }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Logo & Breadcrumbs */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-none tracking-tight">
              ReclamTrack
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Municipal Services
            </span>
          </div>
        </div>

        {breadcrumbs && (
          <nav className="hidden md:flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-400">/</span>}
                <a
                  href={crumb.href}
                  className="text-slate-600 dark:text-slate-400 hover:text-primary"
                >
                  {crumb.label}
                </a>
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 w-80">
          <Search className="text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400"
            placeholder="Search complaint ID, location..."
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        </button>

        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold">{user?.name}</p>
            <p className="text-[10px] text-slate-500 uppercase">{user?.role}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

### 2. Sidebar Component

```tsx
// components/layout/Sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  Map,
  Package,
  Settings,
  BarChart3,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/operations",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Complaints",
    href: "/complaints/list",
    icon: <FileText className="w-5 h-5" />,
    badge: "12",
  },
  {
    label: "Teams",
    href: "/teams/directory",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Planning",
    href: "/teams/planning",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: "Maps",
    href: "/maps/operations",
    icon: <Map className="w-5 h-5" />,
  },
  {
    label: "Inventory",
    href: "/inventory/stock",
    icon: <Package className="w-5 h-5" />,
  },
  {
    label: "Analytics",
    href: "/analytics/operations",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/admin/system",
    icon: <Settings className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col p-4 space-y-2 hidden lg:flex">
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          System Status
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Response Rate
          </span>
          <span className="font-bold text-primary">94%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-[94%]" />
        </div>
      </div>
    </aside>
  );
}
```

---

### 3. KPI Card Component

```tsx
// components/ui/KPICard.tsx
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down";
    label?: string;
  };
  color?: string;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  color = "primary",
  onClick,
}: KPICardProps) {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-green-500 bg-green-500/10",
    warning: "text-orange-500 bg-orange-500/10",
    error: "text-red-500 bg-red-500/10",
  };

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {title}
        </p>
        <span className={`p-1.5 rounded-lg text-lg ${colorClasses[color]}`}>
          {icon}
        </span>
      </div>

      <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">
        {value}
      </p>

      {trend && (
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            trend.direction === "up"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {trend.direction === "up" ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{trend.value}</span>
          {trend.label && (
            <span className="text-slate-400 font-normal">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### 4. Status Badge Component

```tsx
// components/ui/StatusBadge.tsx
type Status = "new" | "in-progress" | "resolved" | "urgent";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const statusConfig = {
  new: {
    label: "New",
    color: "bg-primary/10 text-primary",
    icon: "●",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-amber-100 text-amber-700",
    icon: "◐",
  },
  resolved: {
    label: "Resolved",
    color: "bg-emerald-100 text-emerald-700",
    icon: "✓",
  },
  urgent: {
    label: "Urgent",
    color: "bg-red-100 text-red-700",
    icon: "!",
  },
};

export function StatusBadge({
  status,
  size = "md",
  showIcon = false,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`${config.color} ${sizeClasses[size]} font-black uppercase rounded inline-flex items-center gap-1`}
    >
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
}
```

---

### 5. Data Table Component

```tsx
// components/ui/DataTable.tsx
"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  pagination?: boolean;
  pageSize?: number;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  pagination = true,
  pageSize = 10,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-5 py-3 ${column.sortable ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" : ""}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <span>
                        {sortDirection === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-5 py-4">
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, data.length)} of {data.length}{" "}
            results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🔧 Scripts Utilitaires

### Script de Migration Automatique

```bash
# scripts/migrate-page.sh
#!/bin/bash

PAGE_NAME=$1
ROUTE_PATH=$2

if [ -z "$PAGE_NAME" ] || [ -z "$ROUTE_PATH" ]; then
  echo "Usage: ./migrate-page.sh <page_name> <route_path>"
  echo "Example: ./migrate-page.sh secure_login_screen /login"
  exit 1
fi

SOURCE_DIR="C:/Users/pc gold/Desktop/ticket/Nouveau dossier/ddd/$PAGE_NAME"
TARGET_DIR="./frontend/src/app$ROUTE_PATH"

echo "📦 Migrating $PAGE_NAME to $ROUTE_PATH..."

# Create target directory
mkdir -p "$TARGET_DIR"

# Copy HTML file
cp "$SOURCE_DIR/code.html" "$TARGET_DIR/page.tsx.tmp"

echo "✅ Files copied. Manual conversion required:"
echo "1. Convert HTML to JSX in $TARGET_DIR/page.tsx.tmp"
echo "2. Extract reusable components"
echo "3. Add TypeScript types"
echo "4. Connect to API/state management"
echo "5. Rename page.tsx.tmp to page.tsx"
```

### Script de Validation

```bash
# scripts/validate-migration.sh
#!/bin/bash

echo "🔍 Validating migration..."

# Check for broken links
echo "Checking for href='#' links..."
grep -r "href=\"#\"" frontend/src/app --include="*.tsx" | wc -l

# Check for missing alt attributes
echo "Checking for missing alt attributes..."
grep -r "<img" frontend/src/app --include="*.tsx" | grep -v "alt=" | wc -l

# Check for console.log
echo "Checking for console.log statements..."
grep -r "console.log" frontend/src/app --include="*.tsx" --include="*.ts" | wc -l

# Run TypeScript check
echo "Running TypeScript check..."
npm run type-check

# Run linter
echo "Running ESLint..."
npm run lint

echo "✅ Validation complete!"
```

---

## 📊 Checklist de Migration par Page

### Template Checklist

Pour chaque page migrée, vérifier:

- [ ] **Structure**
  - [ ] Conversion HTML → JSX complète
  - [ ] Imports corrects (React, Next.js, composants)
  - [ ] Metadata page (title, description)
  - [ ] Layout approprié appliqué

- [ ] **Composants**
  - [ ] Composants réutilisables extraits
  - [ ] Props typés (TypeScript)
  - [ ] Composants documentés (JSDoc)

- [ ] **Styling**
  - [ ] Classes Tailwind utilisées
  - [ ] Design tokens respectés
  - [ ] Dark mode fonctionnel
  - [ ] Responsive (mobile, tablet, desktop)

- [ ] **Fonctionnalités**
  - [ ] Navigation fonctionnelle (liens réels)
  - [ ] Formulaires validés (Zod)
  - [ ] API connectée
  - [ ] State management (Zustand/React Query)
  - [ ] Loading states
  - [ ] Error handling

- [ ] **Performance**
  - [ ] Images optimisées (next/image)
  - [ ] Lazy loading composants lourds
  - [ ] Memoization si nécessaire
  - [ ] Bundle size raisonnable

- [ ] **Accessibilité**
  - [ ] Attributs ARIA
  - [ ] Navigation clavier
  - [ ] Contraste couleurs (WCAG AA)
  - [ ] Screen reader friendly

- [ ] **Tests**
  - [ ] Tests unitaires composants
  - [ ] Tests intégration
  - [ ] Tests E2E (scénarios critiques)

---

## 🚀 Commandes Rapides

```bash
# Démarrer le serveur de développement
npm run dev

# Build production
npm run build

# Lancer les tests
npm run test
npm run test:e2e

# Vérifier types TypeScript
npm run type-check

# Linter
npm run lint
npm run lint:fix

# Formater le code
npm run format

# Analyser le bundle
npm run analyze

# Générer un nouveau composant
npm run generate:component ComponentName

# Migrer une page
./scripts/migrate-page.sh page_name /route/path
```

---

## 📈 Métriques de Progrès

### Dashboard de Suivi

| Catégorie      | Total  | Migrées | En cours | Restantes | % Complétion |
| -------------- | ------ | ------- | -------- | --------- | ------------ |
| Auth & Landing | 2      | 2       | 0        | 0         | 100%         |
| Dashboards     | 4      | 4       | 0        | 0         | 100%         |
| Réclamations   | 5      | 5       | 0        | 0         | 100%         |
| Équipes        | 6      | 6       | 0        | 0         | 100%         |
| Cartographie   | 2      | 2       | 0        | 0         | 100%         |
| Inventaire     | 5      | 5       | 0        | 0         | 100%         |
| Documents      | 3      | 3       | 0        | 0         | 100%         |
| Administration | 5      | 5       | 0        | 0         | 100%         |
| Intégrations   | 3      | 3       | 0        | 0         | 100%         |
| E-commerce     | 4      | 4       | 0        | 0         | 100%         |
| **TOTAL**      | **39** | **39**  | **0**    | **0**     | **100%**     |

---

## 🎯 Prochaines Actions Immédiates

### À faire cette semaine:

1. **Jour 1 (Aujourd'hui)**
   - [x] Créer la structure de dossiers Next.js
   - [x] Configurer Tailwind avec design tokens
   - [x] Installer toutes les dépendances

2. **Jour 2**
   - [x] Créer Header component
   - [x] Créer Sidebar component
   - [x] Créer composants UI de base

3. **Jour 3**
   - [x] Migrer page de login
   - [x] Implémenter authStore
   - [x] Tester authentification

4. **Jour 4**
   - [x] Migrer operations dashboard
   - [x] Créer KPICard component
   - [x] Connecter API dashboard

5. **Jour 5**
   - [x] Migrer complaint list
   - [x] Créer DataTable component
   - [x] Tests E2E navigation

---

**Document créé le:** 2026-02-08  
**Version:** 1.0  
**Auteur:** Antigravity AI Assistant  
**Statut:** Ready to Execute 🚀
