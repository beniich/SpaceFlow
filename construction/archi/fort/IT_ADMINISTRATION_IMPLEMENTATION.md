# 🖥️ ReclamTrack - Implémentation Module IT (Suite)

> **Suite du document IT_ADMINISTRATION_ARCHITECTURE.md**

---

## 🔌 API Endpoints - Module IT

### Routes Active Directory

```typescript
// backend/src/routes/ad.ts
import express from 'express';
import { auth, orgContext, requireRole } from '../middleware';
import ActiveDirectoryService from '../services/adService';

const router = express.Router();

// Configuration AD requise
router.use(auth, orgContext, requireRole(['admin', 'superadmin']));

// GET /api/ad/users - Liste utilisateurs AD
router.get('/users', async (req, res) => {
  try {
    const adService = new ActiveDirectoryService(req.organization.adConfig);
    const users = await adService.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/ad/users/:username - Détails utilisateur
router.get('/users/:username', async (req, res) => {
  try {
    const adService = new ActiveDirectoryService(req.organization.adConfig);
    const user = await adService.getUserByUsername(req.params.username);
    const groups = await adService.getUserGroups(req.params.username);
    res.json({ user, groups });
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// POST /api/ad/users - Créer utilisateur AD
router.post('/users', async (req, res) => {
  try {
    const adService = new ActiveDirectoryService(req.organization.adConfig);
    await adService.create User(req.body);

    // Log audit
    await AuditLog.create({
      organizationId: req.organizationId,
      userId: req.user._id,
      action: 'CREATE_AD_USER',
      resource: 'ad_user',
      metadata: { username: req.body.sAMAccountName }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/ad/users/:username/disable - Désactiver utilisateur
router.put('/users/:username/disable', async (req, res) => {
  try {
    const adService = new ActiveDirectoryService(req.organization.adConfig);
    await adService.disableUser(req.params.username);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ad/sync - Synchroniser AD → MongoDB
router.post('/sync', async (req, res) => {
  try {
    const adService = new ActiveDirectoryService(req.organization.adConfig);
    const results = await adService.syncToMongoDB(req.organizationId);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Routes IT Assets

```typescript
// backend/src/routes/it-assets.ts
import express from "express";
import { auth, orgContext } from "../middleware";
import AssetDiscoveryService from "../services/assetDiscoveryService";

const router = express.Router();
router.use(auth, orgContext);

// GET /api/it-assets - Liste assets
router.get("/", async (req, res) => {
  try {
    const { type, status, search } = req.query;

    const query: any = { organizationId: req.organizationId };
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { hostname: new RegExp(search, "i") },
        { ipAddress: new RegExp(search, "i") },
      ];
    }

    const assets = await ITAsset.find(query)
      .populate("assignedTo", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({ assets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/it-assets/:id - Détails asset
router.get("/:id", async (req, res) => {
  try {
    const asset = await ITAsset.findOne({
      _id: req.params.id,
      organizationId: req.organizationId,
    }).populate("assignedTo");

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    res.json({ asset });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/it-assets - Créer asset
router.post("/", async (req, res) => {
  try {
    const asset = await ITAsset.create({
      ...req.body,
      organizationId: req.organizationId,
    });

    res.status(201).json({ asset });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/it-assets/:id - Mettre à jour asset
router.put("/:id", async (req, res) => {
  try {
    const asset = await ITAsset.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.organizationId },
      { $set: req.body, updatedAt: new Date() },
      { new: true },
    );

    res.json({ asset });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/it-assets/discover - Auto-découverte réseau
router.post("/discover", async (req, res) => {
  try {
    const { subnet } = req.body;
    const discoveryService = new AssetDiscoveryService();

    const devices = await discoveryService.scanNetwork(subnet);

    // Créer assets automatiquement
    const created = [];
    for (const device of devices) {
      const asset = await ITAsset.create({
        organizationId: req.organizationId,
        name: device.hostname || device.ip,
        type: "network_device",
        ipAddress: device.ip,
        macAddress: device.mac,
        status: "active",
        notes: "Auto-discovered",
      });
      created.push(asset);
    }

    res.json({
      discovered: devices.length,
      created: created.length,
      assets: created,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Routes Network Monitoring

```typescript
// backend/src/routes/network.ts
import express from "express";
import { auth, orgContext } from "../middleware";
import NetworkMonitoringService from "../services/networkMonitoringService";

const router = express.Router();
router.use(auth, orgContext);

// GET /api/network/devices - Liste devices réseau
router.get("/devices", async (req, res) => {
  try {
    const devices = await NetworkDevice.find({
      organizationId: req.organizationId,
    }).sort({ name: 1 });

    res.json({ devices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/network/devices - Ajouter device
router.post("/devices", async (req, res) => {
  try {
    const device = await NetworkDevice.create({
      ...req.body,
      organizationId: req.organizationId,
    });

    res.status(201).json({ device });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/network/devices/:id/metrics - Métriques device
router.get("/devices/:id/metrics", async (req, res) => {
  try {
    const device = await NetworkDevice.findById(req.params.id);
    const monitoringService = new NetworkMonitoringService();

    const metrics = {
      cpu: await monitoringService.getCPUUsage(device),
      interfaces: await monitoringService.getInterfaceStats(device),
      ping: await monitoringService.pingDevice(device.ipAddress),
    };

    res.json({ metrics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/network/monitor - Lancer monitoring tous devices
router.post("/monitor", async (req, res) => {
  try {
    const monitoringService = new NetworkMonitoringService();
    await monitoringService.monitorAllDevices(req.organizationId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/network/alerts - Alertes réseau
router.get("/alerts", async (req, res) => {
  try {
    const alerts = await NetworkAlert.find({
      organizationId: req.organizationId,
    })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Routes IT Tickets

```typescript
// backend/src/routes/it-tickets.ts
import express from "express";
import { auth, orgContext } from "../middleware";

const router = express.Router();
router.use(auth, orgContext);

// GET /api/it-tickets - Liste tickets
router.get("/", async (req, res) => {
  try {
    const { status, priority, category, assignedTo } = req.query;

    const query: any = { organizationId: req.organizationId };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;

    const tickets = await ITTicket.find(query)
      .populate("requestedBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName")
      .populate("relatedAsset", "name type assetTag")
      .sort({ createdAt: -1 });

    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/it-tickets - Créer ticket
router.post("/", async (req, res) => {
  try {
    const ticket = await ITTicket.create({
      ...req.body,
      organizationId: req.organizationId,
      requestedBy: req.user._id,
    });

    // Notification temps réel
    notificationService.broadcast({
      type: "new_it_ticket",
      message: `New IT ticket: ${ticket.title}`,
      data: ticket,
      targetOrg: req.organizationId,
    });

    res.status(201).json({ ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/it-tickets/:id - Mettre à jour ticket
router.put("/:id", async (req, res) => {
  try {
    const ticket = await ITTicket.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.organizationId },
      { $set: req.body },
      { new: true },
    );

    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/it-tickets/:id/updates - Ajouter update
router.post("/:id/updates", async (req, res) => {
  try {
    const ticket = await ITTicket.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.organizationId },
      {
        $push: {
          updates: {
            timestamp: new Date(),
            userId: req.user._id,
            message: req.body.message,
            internal: req.body.internal || false,
          },
        },
      },
      { new: true },
    );

    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/it-tickets/stats - Statistiques tickets
router.get("/stats", async (req, res) => {
  try {
    const stats = {
      total: await ITTicket.countDocuments({
        organizationId: req.organizationId,
      }),
      byStatus: await ITTicket.aggregate([
        { $match: { organizationId: req.organizationId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      byPriority: await ITTicket.aggregate([
        { $match: { organizationId: req.organizationId } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
      slaBreach: await ITTicket.countDocuments({
        organizationId: req.organizationId,
        "sla.breached": true,
      }),
      avgResolutionTime: await ITTicket.aggregate([
        {
          $match: {
            organizationId: req.organizationId,
            status: "résolu",
            resolvedAt: { $exists: true },
          },
        },
        {
          $project: {
            resolutionTime: {
              $subtract: ["$resolvedAt", "$createdAt"],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgTime: { $avg: "$resolutionTime" },
          },
        },
      ]),
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## 🎨 Interface Frontend - Module IT

### Pages Frontend

```
frontend/src/app/[locale]/(app)/it-admin/
├── page.tsx                    # Dashboard IT principal
├── active-directory/
│   ├── page.tsx                # Gestion AD
│   ├── users/page.tsx          # Liste utilisateurs AD
│   └── sync/page.tsx           # Synchronisation AD
├── assets/
│   ├── page.tsx                # Liste assets
│   ├── [id]/page.tsx           # Détails asset
│   ├── new/page.tsx            # Ajouter asset
│   └── discover/page.tsx       # Auto-discovery
├── network/
│   ├── page.tsx                # Dashboard réseau
│   ├── devices/page.tsx        # Devices réseau
│   ├── topology/page.tsx       # Topologie réseau
│   └── alerts/page.tsx         # Alertes réseau
└── tickets/
    ├── page.tsx                # Liste tickets IT
    ├── [id]/page.tsx           # Détails ticket
    └── new/page.tsx            # Créer ticket
```

### Dashboard IT Principal

```typescript
// frontend/src/app/[locale]/(app)/it-admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {  Server, Network, Ticket, Users, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

export default function ITAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, alertsRes] = await Promise.all([
        api.get('/api/it-admin/stats'),
        api.get('/api/network/alerts?limit=10')
      ]);

      setStats(statsRes.data);
      setRecentAlerts(alertsRes.data.alerts);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">IT Administration</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.assetsThisMonth} ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Network Devices</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.networkDevices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.devicesOnline} online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.urgentTickets} urgent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AD Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adUsers}</div>
            <p className="text-xs text-muted-foreground">
              Last sync: {new Date(stats.lastAdSync).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertes Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <div
                key={alert._id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.severity === 'critical'
                        ? 'bg-red-500'
                        : alert.severity === 'high'
                        ? 'bg-orange-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button className="text-blue-600 hover:underline">
                  Voir détails
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Gestion Active Directory

```typescript
// frontend/src/app/[locale]/(app)/it-admin/active-directory/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { RefreshCw, UserPlus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ActiveDirectoryPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadADUsers();
  }, []);

  const loadADUsers = async () => {
    try {
      const res = await api.get('/api/ad/users');
      setUsers(res.data.users);
    } catch (error) {
      toast.error('Failed to load AD users');
    }
  };

  const syncAD = async () => {
    setSyncing(true);
    try {
      const res = await api.post('/api/ad/sync');
      toast.success(`Synced: ${res.data.imported} imported, ${res.data.updated} updated`);
      await loadADUsers();
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.cn?.toLowerCase().includes(search.toLowerCase()) ||
      user.mail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Active Directory</h1>
        <div className="flex gap-2">
          <Button onClick={syncAD} disabled={syncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            Synchroniser AD
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Créer Utilisateur
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Groupes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {filteredUsers.map((user) => (
              <tr key={user.dn}>
                <td className="px-6 py-4 whitespace-nowrap">{user.cn}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.mail}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.memberOf?.slice(0, 3).map((group: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {group.split(',')[0].split('=')[1]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:underline mr-3">Voir</button>
                  <button className="text-orange-600 hover:underline">Désactiver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 📦 Installation & Configuration

### 1. Dépendances NPM

```bash
# Backend - AD & Monitoring
cd backend
npm install ldapjs activedirectory2 net-snmp ping nmap

# Frontend - Visualisation
cd frontend
npm install recharts react-flow-renderer vis-network
```

### 2. Configuration Environnement

```bash
# backend/.env

# Active Directory
AD_URL=ldaps://dc.example.com:636
AD_BASE_DN=DC=example,DC=com
AD_USERNAME=admin@example.com
AD_PASSWORD=your_password

# SNMP
SNMP_DEFAULT_COMMUNITY=public
SNMP_DEFAULT_VERSION=2c

# Monitoring
MONITORING_INTERVAL=60000      # 60 secondes
PING_INTERVAL=30000            # 30 secondes
```

### 3. Microservices

Créer 4 nouveaux microservices :

```bash
# Structure
microservices/
├── ad-service/           # Port 3007
├── monitoring-service/   # Port 3008
├── asset-service/        # Port 3009
└── helpdesk-service/     # Port 3010
```

### 4. Cr Scheduler Jobs

```typescript
// backend/src/jobs/itMonitoringJob.ts
import cron from "node-cron";
import NetworkMonitoringService from "../services/networkMonitoringService";

// Monitoring toutes les 60 secondes
cron.schedule("*/1 * * * *", async () => {
  console.log("[Job] Running network monitoring...");
  const orgs = await Organization.find({ "features.itAdmin": true });

  for (const org of orgs) {
    const monitoringService = new NetworkMonitoringService();
    await monitoringService.monitorAllDevices(org._id);
  }
});

// Sync AD tous les jours à 2h du matin
cron.schedule("0 2 * * *", async () => {
  console.log("[Job] Running AD sync...");
  const orgs = await Organization.find({ "adConfig.enabled": true });

  for (const org of orgs) {
    const adService = new ActiveDirectoryService(org.adConfig);
    await adService.syncToMongoDB(org._id);
  }
});
```

---

## 🔒 Sécurité

### 1. Chiffrement Credentials AD

```typescript
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift()!, "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
```

### 2. Permissions Spécifiques

```typescript
enum ITPermission {
  VIEW_AD = "it:ad:view",
  MANAGE_AD = "it:ad:manage",
  VIEW_ASSETS = "it:assets:view",
  MANAGE_ASSETS = "it:assets:manage",
  VIEW_NETWORK = "it:network:view",
  MANAGE_NETWORK = "it:network:manage",
  VIEW_TICKETS = "it:tickets:view",
  MANAGE_TICKETS = "it:tickets:manage",
}

// Middleware
const requireITPermission = (permission: ITPermission) => {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

// Usage
router.post(
  "/ad/users",
  auth,
  requireITPermission(ITPermission.MANAGE_AD),
  createADUser,
);
```

---

## 📊 Métriques & Monitoring

### Métriques Prometheus

``typescript
// backend/src/metrics/itMetrics.ts
import client from 'prom-client';

// Compteur assets
export const assetsTotal = new client.Gauge({
name: 'it_assets_total',
help: 'Total number of IT assets',
labelNames: ['type', 'status']
});

// Compteur devices réseau
export const networkDevicesOnline = new client.Gauge({
name: 'network_devices_online',
help: 'Number of online network devices'
});

// Tickets IT
export const itTicketsOpen = new client.Gauge({
name: 'it_tickets_open',
help: 'Number of open IT tickets',
labelNames: ['priority']
});

// SLA breach
export const slaBreachTotal = new client.Counter({
name: 'it_sla_breach_total',
help: 'Total number of SLA breaches'
});

```

---

## 🚀 Roadmap Implémentation

### Phase 1: Foundation (Semaine 1-2)
- [x] Modèles MongoDB (ITAsset, NetworkDevice, ITTicket)
- [x] Service Active Directory de base
- [x] Routes API backend
- [x] Interface dashboard IT

### Phase 2: Active Directory (Semaine 3-4)
- [ ] Intégration LDAP complète
- [ ] Sync bidirectionnelle AD ↔ MongoDB
- [ ] Interface gestion utilisateurs AD
- [ ] Tests authentification AD

### Phase 3: Assets & Discovery (Semaine 5-6)
- [ ] Auto-discovery réseau (NMAP)
- [ ] Import depuis AD
- [ ] Interface gestion assets
- [ ] Tracking lifecycle assets

### Phase 4: Monitoring Réseau (Semaine 7-8)
- [ ] Intégration SNMP
- [ ] Monitoring temps réel
- [ ] Système d'alertes
- [ ] Dashboards Grafana

### Phase 5: Helpdesk IT (Semaine 9-10)
- [ ] Système tickets IT
- [ ] SLA automatiques
- [ ] Auto-assignment intelligent
- [ ] Interface agents/utilisateurs

---

**Document créé le:** 2026-02-17
**Version:** 1.0
**Prochaine révision:** TBD
```
