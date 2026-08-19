# 🎣 ReclamTrack - Hooks React pour Module IT

> **Hooks personnalisés pour le module IT suivant le pattern `useReclamations`**  
> Date: 2026-02-17

---

## 📋 Vue d'Ensemble

Nous allons créer des hooks IT **identiques en structure** au hook `useReclamations` existant pour assurer la cohérence du code :

```typescript
// EXISTANT
useReclamations()  → Réclamations citoyennes

// NOUVEAU (Module IT)
useITTickets()     → Tickets IT (helpdesk)
useITAssets()      → Assets IT (inventaire)
useNetworkDevices() → Devices réseau (monitoring)
useADUsers()       → Utilisateurs AD
```

---

## 🎫 Hook: useITTickets

### Interface TypeScript

```typescript
// frontend/src/hooks/useITTickets.ts

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ITTicket {
  _id: string;
  ticketNumber: string; // "IT-2026-0042"
  title: string;
  description: string;
  category:
    | "hardware"
    | "software"
    | "network"
    | "account"
    | "email"
    | "printing"
    | "phone"
    | "security"
    | "other";
  priority: "critique" | "haute" | "moyenne" | "faible" | "basse";
  status:
    | "nouveau"
    | "assigné"
    | "en_cours"
    | "en_attente"
    | "résolu"
    | "fermé"
    | "annulé";

  // Relations
  requestedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  relatedAsset?: {
    _id: string;
    name: string;
    assetTag: string;
  };

  // SLA
  sla: {
    responseTime: number;
    resolutionTime: number;
    responseDeadline: string;
    resolutionDeadline: string;
    breached: boolean;
  };

  // Workflow
  updates: {
    timestamp: string;
    userId: string;
    message: string;
    internal: boolean;
  }[];

  // Resolution
  resolution?: {
    summary: string;
    rootCause: string;
    solution: string;
  };

  // Satisfaction
  satisfaction?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };

  // Metadata
  source: "web" | "email" | "phone" | "chat" | "auto_monitoring";
  createdAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface ITTicketStats {
  nouveau: number;
  assigné: number;
  en_cours: number;
  en_attente: number;
  résolu: number;
  fermé: number;
  total: number;
  slaBreach: number;
}

export interface ITTicketFilters {
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────
// Hook principal : useITTickets
// ─────────────────────────────────────────────
export function useITTickets(filters: ITTicketFilters = {}) {
  const [tickets, setTickets] = useState<ITTicket[]>([]);
  const [stats, setStats] = useState<ITTicketStats>({
    nouveau: 0,
    assigné: 0,
    en_cours: 0,
    en_attente: 0,
    résolu: 0,
    fermé: 0,
    total: 0,
    slaBreach: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status && filters.status !== "tous")
        params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.category) params.append("category", filters.category);
      if (filters.assignedTo) params.append("assignedTo", filters.assignedTo);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.limit) params.append("limit", String(filters.limit));

      const res = await fetch(`${API_URL}/it-tickets?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setTickets(data.data);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }, [
    filters.status,
    filters.priority,
    filters.category,
    filters.assignedTo,
    filters.search,
    filters.page,
  ]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // ── Créer un ticket IT ──
  const createTicket = async (payload: Partial<ITTicket>) => {
    const res = await fetch(`${API_URL}/it-tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.errors?.join(", ") || data.message);
    await fetchTickets();
    return data.data;
  };

  // ── Changer le statut ──
  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/it-tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    // Optimistic update
    setTickets((prev) =>
      prev.map((t) =>
        t.ticketNumber === id || t._id === id
          ? { ...t, status: status as any }
          : t,
      ),
    );
    return data.data;
  };

  // ── Ajouter une mise à jour ──
  const addUpdate = async (id: string, message: string, internal = false) => {
    const res = await fetch(`${API_URL}/it-tickets/${id}/updates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ message, internal }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    await fetchTickets();
    return data.data;
  };

  // ── Assigner ticket ──
  const assignTicket = async (id: string, userId: string) => {
    const res = await fetch(`${API_URL}/it-tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ assignedTo: userId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    await fetchTickets();
    return data.data;
  };

  // ── Résoudre ticket ──
  const resolveTicket = async (
    id: string,
    resolution: Partial<ITTicket["resolution"]>,
  ) => {
    const res = await fetch(`${API_URL}/it-tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: "résolu", resolution }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    await fetchTickets();
    return data.data;
  };

  // ── Supprimer ──
  const deleteTicket = async (id: string) => {
    const res = await fetch(`${API_URL}/it-tickets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    setTickets((prev) =>
      prev.filter((t) => t.ticketNumber !== id && t._id !== id),
    );
  };

  return {
    tickets,
    stats,
    loading,
    error,
    pagination,
    refetch: fetchTickets,
    createTicket,
    updateStatus,
    addUpdate,
    assignTicket,
    resolveTicket,
    deleteTicket,
  };
}
```

---

## 🖥️ Hook: useITAssets

```typescript
// frontend/src/hooks/useITAssets.ts

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ITAsset {
  _id: string;
  assetTag: string; // "IT-ASSET-001"
  name: string;
  type:
    | "server"
    | "workstation"
    | "laptop"
    | "network_device"
    | "printer"
    | "mobile_device"
    | "storage"
    | "ups"
    | "other";
  status: "active" | "inactive" | "maintenance" | "retired" | "broken";

  // Hardware
  manufacturer?: string;
  model?: string;
  serialNumber?: string;

  // Network
  hostname?: string;
  ipAddress?: string;
  macAddress?: string;

  // Server specs
  operatingSystem?: string;
  cpu?: string;
  ram?: number;
  storage?: number;

  // Location
  location?: {
    building: string;
    floor: string;
    room: string;
  };

  // Assignment
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
  };

  // Maintenance
  purchaseDate?: string;
  warrantyExpiration?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;

  // Monitoring
  monitoringEnabled: boolean;
  lastSeenOnline?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ITAssetFilters {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useITAssets(filters: ITAssetFilters = {}) {
  const [assets, setAssets] = useState<ITAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.limit) params.append("limit", String(filters.limit));

      const res = await fetch(`${API_URL}/it-assets?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setAssets(data.assets);
      setPagination(
        data.pagination || { total: data.assets.length, page: 1, pages: 1 },
      );
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, [filters.type, filters.status, filters.search, filters.page]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const createAsset = async (payload: Partial<ITAsset>) => {
    const res = await fetch(`${API_URL}/it-assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    await fetchAssets();
    return data.asset;
  };

  const updateAsset = async (id: string, updates: Partial<ITAsset>) => {
    const res = await fetch(`${API_URL}/it-assets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    // Optimistic update
    setAssets((prev) =>
      prev.map((a) => (a._id === id ? { ...a, ...updates } : a)),
    );
    return data.asset;
  };

  const deleteAsset = async (id: string) => {
    const res = await fetch(`${API_URL}/it-assets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    setAssets((prev) => prev.filter((a) => a._id !== id));
  };

  // Auto-discovery réseau
  const discoverAssets = async (subnet: string) => {
    const res = await fetch(`${API_URL}/it-assets/discover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ subnet }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    await fetchAssets();
    return data;
  };

  return {
    assets,
    loading,
    error,
    pagination,
    refetch: fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    discoverAssets,
  };
}
```

---

## 🌐 Hook: useNetworkDevices

```typescript
// frontend/src/hooks/useNetworkDevices.ts

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface NetworkDevice {
  _id: string;
  name: string;
  type: "router" | "switch" | "firewall" | "access_point" | "gateway";
  ipAddress: string;
  manufacturer?: string;
  model?: string;

  // SNMP
  snmpEnabled: boolean;
  snmpVersion?: "v1" | "v2c" | "v3";

  // Monitoring
  monitoringEnabled: boolean;
  currentMetrics?: {
    cpuUsage: number;
    memoryUsage: number;
    uptime: number;
    isOnline: boolean;
    lastSeen: string;
  };

  // Interfaces
  interfaces?: Array<{
    name: string;
    status: "up" | "down";
    speed: number;
    vlan?: number;
  }>;

  createdAt: string;
}

export function useNetworkDevices() {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/network/devices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setDevices(data.devices);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const createDevice = async (payload: Partial<NetworkDevice>) => {
    const res = await fetch(`${API_URL}/network/devices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    await fetchDevices();
    return data.device;
  };

  const getDeviceMetrics = async (id: string) => {
    const res = await fetch(`${API_URL}/network/devices/${id}/metrics`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.metrics;
  };

  const startMonitoring = async () => {
    const res = await fetch(`${API_URL}/network/monitor`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data;
  };

  return {
    devices,
    loading,
    error,
    refetch: fetchDevices,
    createDevice,
    getDeviceMetrics,
    startMonitoring,
  };
}
```

---

## 👥 Hook: useADUsers

```typescript
// frontend/src/hooks/useADUsers.ts

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ADUser {
  dn: string;
  cn: string;
  sAMAccountName: string;
  mail?: string;
  givenName?: string;
  sn?: string;
  memberOf?: string[];
}

export function useADUsers() {
  const [users, setUsers] = useState<ADUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/ad/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const syncAD = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`${API_URL}/ad/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await fetchUsers();
      return data;
    } catch (err: any) {
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const createADUser = async (userData: any) => {
    const res = await fetch(`${API_URL}/ad/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    await fetchUsers();
    return data;
  };

  const disableUser = async (username: string) => {
    const res = await fetch(`${API_URL}/ad/users/${username}/disable`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    await fetchUsers();
  };

  return {
    users,
    loading,
    error,
    syncing,
    refetch: fetchUsers,
    syncAD,
    createADUser,
    disableUser,
  };
}
```

---

## 🎯 Usage dans les Composants

### Exemple: Page Liste Tickets IT

```typescript
// frontend/src/app/[locale]/(app)/it-admin/tickets/page.tsx

'use client';

import { useState } from 'react';
import { useITTickets } from '@/hooks/useITTickets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function ITTicketsPage() {
  const [filters, setFilters] = useState({ status: 'tous', search: '' });

  const {
    tickets,
    stats,
    loading,
    error,
    updateStatus,
    addUpdate,
    createTicket
  } = useITTickets(filters);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus(id, newStatus);
      toast.success('Statut mis à jour');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddComment = async (id: string, message: string) => {
    try {
      await addUpdate(id, message);
      toast.success('Commentaire ajouté');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tickets IT</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatsCard label="Nouveau" count={stats.nouveau} color="blue" />
        <StatsCard label="En cours" count={stats.en_cours} color="orange" />
        <StatsCard label="En attente" count={stats.en_attente} color="purple" />
        <StatsCard label="Résolu" count={stats.résolu} color="green" />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border rounded px-4"
        >
          <option value="tous">Tous les statuts</option>
          <option value="nouveau">Nouveau</option>
          <option value="en_cours">En cours</option>
          <option value="résolu">Résolu</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Ticket</th>
              <th className="p-4 text-left">Titre</th>
              <th className="p-4 text-left">Catégorie</th>
              <th className="p-4 text-left">Priorité</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{ticket.ticketNumber}</td>
                <td className="p-4">{ticket.title}</td>
                <td className="p-4"><CategoryBadge category={ticket.category} /></td>
                <td className="p-4"><PriorityBadge priority={ticket.priority} /></td>
                <td className="p-4"><StatusBadge status={ticket.status} /></td>
                <td className="p-4">
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(ticket._id, getNextStatus(ticket.status))}
                  >
                    Avancer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getNextStatus(current: string): string {
  const flow = ['nouveau', 'assigné', 'en_cours', 'en_attente', 'résolu', 'fermé'];
  const index = flow.indexOf(current);
  return flow[index + 1] || current;
}
```

---

## 🔧 Backend Routes - Configuration

```typescript
// backend/src/index.ts (ou app.ts)

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// ========== ROUTES EXISTANTES ==========
import reclamationRoutes from "./routes/reclamationRoutes";

// ========== ROUTES IT (NOUVELLES) ==========
import itTicketRoutes from "./routes/it-tickets";
import itAssetsRoutes from "./routes/it-assets";
import networkRoutes from "./routes/network";
import adRoutes from "./routes/ad";

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/reclamtrack")
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// ========== ROUTES ==========

// Module Citoyens (existant)
app.use("/api/reclamations", reclamationRoutes);

// Module IT (nouveau)
app.use("/api/it-tickets", itTicketRoutes);
app.use("/api/it-assets", itAssetsRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/ad", adRoutes);

// Health check
app.use("/api/health", (_, res) => res.json({ status: "ok" }));

// Error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Erreur:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  },
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend sur http://localhost:${PORT}`));
```

---

## 📊 Comparaison Hooks

| Feature                 | useReclamations                | useITTickets                   | useITAssets     | useNetworkDevices |
| ----------------------- | ------------------------------ | ------------------------------ | --------------- | ----------------- |
| **Filtres**             | ✅ Statut, priorité, catégorie | ✅ Status, priorité, catégorie | ✅ Type, status | ❌                |
| **Search**              | ✅ Oui                         | ✅ Oui                         | ✅ Oui          | ❌                |
| **Pagination**          | ✅ Oui                         | ✅ Oui                         | ✅ Oui          | ❌                |
| **Stats**               | ✅ Par statut                  | ✅ Par status + SLA            | ❌              | ❌                |
| **CRUD**                | ✅ Complet                     | ✅ Complet                     | ✅ Complet      | ✅ Partiel        |
| **Actions spécifiques** | Commentaires                   | Updates, Assign, Resolve       | Discovery       | Metrics, Monitor  |
| **Auth**                | ❌ Public                      | ✅ Bearer token                | ✅ Bearer token | ✅ Bearer token   |

---

## ✅ Checklist d'Implémentation

### Frontend

- [ ] Créer `/hooks/useITTickets.ts`
- [ ] Créer `/hooks/useITAssets.ts`
- [ ] Créer `/hooks/useNetworkDevices.ts`
- [ ] Créer `/hooks/useADUsers.ts`
- [ ] Réutiliser composants `PriorityBadge`, `Timeline` existants
- [ ] Créer nouveaux composants spécifiques IT
- [ ] Implémenter pages IT admin

### Backend

- [ ] Routes `/api/it-tickets` (CRUD + updates + assign)
- [ ] Routes `/api/it-assets` (CRUD + discovery)
- [ ] Routes `/api/network` (devices + metrics + monitoring)
- [ ] Routes `/api/ad` (users + sync + create)
- [ ] Middleware auth (JWT Bearer)
- [ ] Modèles MongoDB (4 nouvelles collections)

---

**Résultat:** Tous les hooks IT **suivent exactement le même pattern** que `useReclamations`, assurant une **cohérence parfaite** du code et une **maintenance facile**.

**Date:** 2026-02-17  
**Version:** 1.0
