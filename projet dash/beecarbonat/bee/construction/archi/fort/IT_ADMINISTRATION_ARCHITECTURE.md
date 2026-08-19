# 🖥️ ReclamTrack - Module d'Administration IT & Active Directory

> **Architecture pour l'intégration de l'administration système, réseau et Active Directory**  
> Version: 1.0  
> Date: 2026-02-17

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#-vue-densemble)
2. [Architecture Technique](#-architecture-technique)
3. [Intégration Active Directory](#-intégration-active-directory)
4. [Gestion des Assets IT](#-gestion-des-assets-it)
5. [Monitoring Réseau](#-monitoring-réseau)
6. [Tickets IT](#-tickets-it)
7. [Modèles de Données](#-modèles-de-données)
8. [API Endpoints](#-api-endpoints)
9. [Interface Frontend](#-interface-frontend)
10. [Sécurité & Permissions](#-sécurité--permissions)
11. [Implémentation](#-implémentation)

---

## 🎯 Vue d'Ensemble

### Objectifs

Transformer ReclamTrack en une **plateforme unifiée** combinant:

- ✅ Gestion des réclamations citoyennes (existant)
- 🆕 Administration Active Directory
- 🆕 Gestion des assets IT (serveurs, switches, postes)
- 🆕 Monitoring réseau en temps réel
- 🆕 Helpdesk IT & tickets techniques
- 🆕 Inventaire matériel informatique

### Cas d'Usage

```
┌─────────────────────────────────────────────────────────────┐
│                    SCÉNARIOS D'UTILISATION                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. ADMIN SYSTÈME                                           │
│     • Synchronise utilisateurs depuis AD                   │
│     • Gère groupes de sécurité                             │
│     • Surveille serveurs (CPU, RAM, Disk)                  │
│     • Reçoit alertes incidents réseau                      │
│                                                             │
│  2. ADMIN RÉSEAU                                            │
│     • Visualise topologie réseau                           │
│     • Configure switches/routers                           │
│     • Analyse traffic réseau                               │
│     • Gère VLANs et sous-réseaux                           │
│                                                             │
│  3. HELPDESK IT                                             │
│     • Reçoit tickets utilisateurs                          │
│     • Diagnostique problèmes (AD, réseau, hardware)        │
│     • Gère inventaire matériel                             │
│     • Déploie logiciels via AD                             │
│                                                             │
│  4. DIRECTION IT                                            │
│     • Dashboard consolidé (réclamations + IT)              │
│     • Rapports SLA et performance                          │
│     • Budget et coûts infrastructure                       │
│     • Planification capacité                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Technique

### Architecture Globale avec Module IT

```
┌─────────────────────────────────────────────────────────────────────┐
│                         RECLAMTRACK 3.0 + IT                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                       │
│  ┌────────────────────────┐  ┌──────────────────────────┐   │
│  │  Module Citoyens       │  │  Module IT Admin         │   │
│  │  • Réclamations        │  │  • Active Directory      │   │
│  │  • Carte               │  │  • Assets IT             │   │
│  │  • Feedback            │  │  • Monitoring Réseau     │   │
│  └────────────────────────┘  │  • Tickets IT            │   │
│                               │  • Inventaire            │   │
│                               └──────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                       │
│  ┌────────────────────────┐  ┌──────────────────────────┐   │
│  │  Core Routes           │  │  IT Admin Routes         │   │
│  │  • /api/complaints     │  │  • /api/ad               │   │
│  │  • /api/teams          │  │  • /api/it-assets        │   │
│  │  • /api/organizations  │  │  • /api/network          │   │
│  └────────────────────────┘  │  • /api/it-tickets       │   │
│                               │  • /api/monitoring       │   │
│                               └──────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │
         ┌─────────┴──────────────┐
         │                        │
         ▼                        ▼
┌──────────────────┐    ┌──────────────────────────┐
│    MongoDB       │    │  Active Directory        │
│                  │    │  (LDAP/LDAPS)            │
│  Collections:    │    │                          │
│  • complaints    │    │  • Domain Controllers    │
│  • it_assets     │    │  • Users (OU)            │
│  • network_devices│   │  • Groups                │
│  • it_tickets    │    │  • Computers             │
│  • ad_sync_logs  │    │  • GPOs                  │
└──────────────────┘    └──────────────────────────┘
         │
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                    NEW MICROSERVICES                          │
│  ┌────────────────────────┐  ┌──────────────────────────┐   │
│  │  AD-Service (3007)     │  │  Monitoring-Service      │   │
│  │  • LDAP sync           │  │  (3008)                  │   │
│  │  • User provisioning   │  │  • SNMP polling          │   │
│  │  • Group management    │  │  • Ping/traceroute       │   │
│  └────────────────────────┘  │  • Bandwidth monitoring  │   │
│                               └──────────────────────────┘   │
│  ┌────────────────────────┐  ┌──────────────────────────┐   │
│  │  Asset-Service (3009)  │  │  Helpdesk-Service (3010) │   │
│  │  • Inventory tracking  │  │  • Ticket routing        │   │
│  │  • Asset lifecycle     │  │  • SLA tracking          │   │
│  │  • License management  │  │  • Knowledge base        │   │
│  └────────────────────────┘  └──────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     MONITORING STACK                          │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │  Prometheus    │  │  Grafana       │  │  ELK Stack   │   │
│  │  • IT Metrics  │  │  • IT Dashboards│  │  • Logs      │   │
│  └────────────────┘  └────────────────┘  └──────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Intégration Active Directory

### Architecture LDAP

```
┌─────────────────────────────────────────────────────────────┐
│              STRATÉGIE D'INTÉGRATION AD                      │
└─────────────────────────────────────────────────────────────┘

[APPROCHE 1: SYNCHRONISATION PÉRIODIQUE]
┌──────────────────────────────────────────────────────────┐
│  ReclamTrack Backend                                     │
│  │                                                        │
│  ▼                                                        │
│  Cron Job (toutes les 15 min)                           │
│  └─> AD-Service.syncUsers()                             │
│      │                                                    │
│      ▼                                                    │
│      LDAP Client → Connexion LDAPS://dc.domain.local:636│
│      │                                                    │
│      ▼                                                    │
│      Query: (&(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))│
│      │                                                    │
│      ▼                                                    │
│      Récupère: CN, sAMAccountName, mail, memberOf       │
│      │                                                    │
│      ▼                                                    │
│      Pour chaque user AD:                               │
│        • Crée/Met à jour dans MongoDB (users collection)│
│        • Synchronise groupes → roles ReclamTrack        │
│        • Enregistre dans ad_sync_logs                   │
└──────────────────────────────────────────────────────────┘

[APPROCHE 2: AUTHENTIFICATION DIRECTE]
┌──────────────────────────────────────────────────────────┐
│  User Login                                              │
│  └─> POST /api/auth/ad-login                            │
│       Body: { username, password }                       │
│       │                                                   │
│       ▼                                                   │
│       LDAP Bind Attempt                                  │
│       ldap.bind(username@domain.com, password)          │
│       │                                                   │
│       ├─> Success: Generate JWT + Create/Update user    │
│       └─> Failure: Return 401                           │
└──────────────────────────────────────────────────────────┘

[APPROCHE 3: GESTION BIDIRECTIONNELLE]
┌──────────────────────────────────────────────────────────┐
│  ReclamTrack ←──→ Active Directory                       │
│                                                           │
│  Actions depuis ReclamTrack:                             │
│  • Créer utilisateur AD                                  │
│  • Désactiver compte                                     │
│  • Ajouter/Retirer de groupes                           │
│  • Réinitialiser mot de passe                           │
│  • Déplacer entre OUs                                    │
│                                                           │
│  Actions depuis AD (sync):                               │
│  • Importer nouveaux utilisateurs                        │
│  • Synchroniser modifications                            │
│  • Désactiver comptes supprimés                         │
└──────────────────────────────────────────────────────────┘
```

### Implémentation LDAP

**Package Node.js:**

```bash
npm install ldapjs activedirectory2
```

**Service AD (backend/src/services/adService.ts):**

```typescript
import ActiveDirectory from "activedirectory2";
import ldap from "ldapjs";

interface ADConfig {
  url: string; // ldaps://dc.example.com:636
  baseDN: string; // DC=example,DC=com
  username: string; // admin@example.com
  password: string; // admin password
}

class ActiveDirectoryService {
  private ad: any;
  private ldapClient: any;

  constructor(config: ADConfig) {
    // ActiveDirectory pour queries simplifiées
    this.ad = new ActiveDirectory({
      url: config.url,
      baseDN: config.baseDN,
      username: config.username,
      password: config.password,
      attributes: {
        user: ["cn", "sAMAccountName", "mail", "memberOf", "telephoneNumber"],
      },
    });

    // LDAP client pour opérations avancées
    this.ldapClient = ldap.createClient({
      url: config.url,
      tlsOptions: { rejectUnauthorized: false }, // Dev only
    });
  }

  // Authentification utilisateur
  async authenticateUser(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.ad.authenticate(username, password, (err, auth) => {
        if (err) reject(err);
        resolve(auth);
      });
    });
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query =
        "(&(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))";
      this.ad.findUsers(query, (err, users) => {
        if (err) reject(err);
        resolve(users || []);
      });
    });
  }

  // Récupérer utilisateur par sAMAccountName
  async getUserByUsername(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ad.findUser(username, (err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });
  }

  // Récupérer groupes d'un utilisateur
  async getUserGroups(username: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.ad.getGroupMembershipForUser(username, (err, groups) => {
        if (err) reject(err);
        resolve(groups?.map((g) => g.cn) || []);
      });
    });
  }

  // Créer utilisateur AD
  async createUser(userData: {
    cn: string;
    sAMAccountName: string;
    userPrincipalName: string;
    givenName: string;
    sn: string;
    mail: string;
    password: string;
    ou: string; // OU=Users,DC=example,DC=com
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const dn = `CN=${userData.cn},${userData.ou}`;
      const entry = {
        objectClass: ["top", "person", "organizationalPerson", "user"],
        cn: userData.cn,
        sAMAccountName: userData.sAMAccountName,
        userPrincipalName: userData.userPrincipalName,
        givenName: userData.givenName,
        sn: userData.sn,
        mail: userData.mail,
        userAccountControl: 512, // Normal account
        unicodePwd: this.encodePassword(userData.password),
      };

      this.ldapClient.add(dn, entry, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Désactiver compte
  async disableUser(username: string): Promise<void> {
    const user = await this.getUserByUsername(username);
    const change = new ldap.Change({
      operation: "replace",
      modification: {
        userAccountControl: 514, // Disabled account
      },
    });

    return new Promise((resolve, reject) => {
      this.ldapClient.modify(user.dn, change, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Ajouter à un groupe
  async addUserToGroup(username: string, groupDN: string): Promise<void> {
    const user = await this.getUserByUsername(username);
    const change = new ldap.Change({
      operation: "add",
      modification: {
        member: user.dn,
      },
    });

    return new Promise((resolve, reject) => {
      this.ldapClient.modify(groupDN, change, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Synchronisation complète
  async syncToMongoDB(organizationId: string): Promise<{
    imported: number;
    updated: number;
    errors: any[];
  }> {
    const users = await this.getAllUsers();
    const results = { imported: 0, updated: 0, errors: [] };

    for (const adUser of users) {
      try {
        const groups = await this.getUserGroups(adUser.sAMAccountName);
        const role = this.mapGroupsToRole(groups);

        // Vérifier si user existe
        const existingUser = await User.findOne({
          email: adUser.mail || `${adUser.sAMAccountName}@example.com`,
        });

        if (existingUser) {
          // Mise à jour
          await User.findByIdAndUpdate(existingUser._id, {
            firstName: adUser.givenName,
            lastName: adUser.sn,
            phone: adUser.telephoneNumber,
            role,
            adSyncedAt: new Date(),
            adGroups: groups,
          });
          results.updated++;
        } else {
          // Création
          await User.create({
            email: adUser.mail || `${adUser.sAMAccountName}@example.com`,
            firstName: adUser.givenName,
            lastName: adUser.sn,
            phone: adUser.telephoneNumber,
            role,
            adUsername: adUser.sAMAccountName,
            adSyncedAt: new Date(),
            adGroups: groups,
            authMethod: "ad",
          });

          // Créer membership
          await Membership.create({
            userId: newUser._id,
            organizationId,
            role,
            status: "active",
          });
          results.imported++;
        }

        // Log de sync
        await ADSyncLog.create({
          organizationId,
          username: adUser.sAMAccountName,
          action: existingUser ? "updated" : "imported",
          timestamp: new Date(),
        });
      } catch (error) {
        results.errors.push({
          username: adUser.sAMAccountName,
          error: error.message,
        });
      }
    }

    return results;
  }

  // Mapper groupes AD → rôles ReclamTrack
  private mapGroupsToRole(groups: string[]): string {
    if (groups.includes("Domain Admins") || groups.includes("IT Admins")) {
      return "admin";
    } else if (groups.includes("IT Managers")) {
      return "manager";
    } else if (groups.includes("IT Support")) {
      return "agent";
    } else {
      return "citizen";
    }
  }

  // Encoder mot de passe pour AD
  private encodePassword(password: string): string {
    return Buffer.from(`"${password}"`, "utf16le").toString();
  }
}

export default ActiveDirectoryService;
```

---

## 🖥️ Gestion des Assets IT

### Types d'Assets

```typescript
enum AssetType {
  SERVER = "server",
  WORKSTATION = "workstation",
  LAPTOP = "laptop",
  NETWORK_DEVICE = "network_device", // Switch, Router, Firewall
  PRINTER = "printer",
  MOBILE_DEVICE = "mobile_device",
  STORAGE = "storage",
  UPS = "ups",
  OTHER = "other",
}

enum AssetStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
  RETIRED = "retired",
  BROKEN = "broken",
}
```

### Modèle MongoDB

```typescript
// backend/src/models/ITAsset.ts
import mongoose, { Schema } from "mongoose";

const ITAssetSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // Identification
    assetTag: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(AssetType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AssetStatus),
      default: "active",
    },

    // Informations matériel
    manufacturer: String,
    model: String,
    serialNumber: String,

    // Informations réseau
    hostname: String,
    ipAddress: String,
    macAddress: String,
    subnet: String,
    vlan: Number,

    // Pour serveurs
    operatingSystem: String,
    cpu: String,
    ram: Number, // en GB
    storage: Number, // en GB

    // Localisation
    location: {
      building: String,
      floor: String,
      room: String,
      rack: String,
      rackUnit: Number,
    },

    // Gestion
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    purchaseDate: Date,
    warrantyExpiration: Date,
    purchasePrice: Number,
    vendor: String,

    // Licences logicielles
    software: [
      {
        name: String,
        version: String,
        licenseKey: String,
        expirationDate: Date,
      },
    ],

    // Monitoring
    monitoringEnabled: {
      type: Boolean,
      default: false,
    },
    lastSeenOnline: Date,
    uptime: Number, // en secondes

    // Maintenance
    maintenanceSchedule: String, // 'monthly', 'quarterly', 'yearly'
    lastMaintenance: Date,
    nextMaintenance: Date,
    maintenanceHistory: [
      {
        date: Date,
        type: String,
        performedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        notes: String,
        cost: Number,
      },
    ],

    // Métadonnées
    notes: String,
    tags: [String],
    customFields: Schema.Types.Mixed,

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  {
    timestamps: true,
  },
);

// Indexes
ITAssetSchema.index({ organizationId: 1, type: 1 });
ITAssetSchema.index({ organizationId: 1, status: 1 });
ITAssetSchema.index({ hostname: 1 });
ITAssetSchema.index({ ipAddress: 1 });

export default mongoose.model("ITAsset", ITAssetSchema);
```

### Auto-Discovery des Assets

```typescript
// backend/src/services/assetDiscoveryService.ts
import ping from "ping";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

class AssetDiscoveryService {
  // Scanner réseau avec NMAP
  async scanNetwork(subnet: string): Promise<any[]> {
    try {
      const { stdout } = await execPromise(`nmap -sn ${subnet} -oX -`);
      // Parser XML results
      const devices = this.parseNmapXML(stdout);
      return devices;
    } catch (error) {
      console.error("Network scan failed:", error);
      return [];
    }
  }

  // Ping sweep
  async pingSweep(subnet: string): Promise<string[]> {
    const activeHosts: string[] = [];
    const baseIP = subnet.split("/")[0].split(".").slice(0, 3).join(".");

    const promises = [];
    for (let i = 1; i <= 254; i++) {
      const ip = `${baseIP}.${i}`;
      promises.push(
        ping.promise.probe(ip, { timeout: 1 }).then((res) => {
          if (res.alive) activeHosts.push(ip);
        }),
      );
    }

    await Promise.all(promises);
    return activeHosts;
  }

  // Récupérer infos via SNMP
  async getSNMPInfo(ip: string, community: string = "public"): Promise<any> {
    // Utiliser snmp npm package
    // Récupérer: sysDescr, sysName, sysUpTime, etc.
  }

  // Importer depuis AD (ordinateurs)
  async importFromAD(adService: ActiveDirectoryService): Promise<any[]> {
    const computers = await adService.getAllComputers();
    const imported = [];

    for (const computer of computers) {
      const asset = await ITAsset.create({
        organizationId: req.organizationId,
        assetTag: computer.cn,
        name: computer.cn,
        type: "workstation",
        hostname: computer.dNSHostName,
        operatingSystem: computer.operatingSystem,
        status: "active",
        notes: `Imported from AD: ${computer.distinguishedName}`,
      });
      imported.push(asset);
    }

    return imported;
  }
}

export default AssetDiscoveryService;
```

---

## 📡 Monitoring Réseau

### Architecture Monitoring

```
┌─────────────────────────────────────────────────────────────┐
│                 MONITORING ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────┘

[COLLECTE DE MÉTRIQUES]
┌──────────────────────────────────────────────────────────┐
│  Monitoring Service (Port 3008)                          │
│  │                                                        │
│  ├─> SNMP Poller (chaque 60s)                          │
│  │   └─> Query switches/routers                         │
│  │       • Interface stats (in/out bytes)               │
│  │       • CPU/RAM usage                                │
│  │       • Uptime                                        │
│  │                                                        │
│  ├─> Ping Monitor (chaque 30s)                          │
│  │   └─> Ping tous les assets critiques                │
│  │       • Latency                                       │
│  │       • Packet loss                                   │
│  │       • Availability                                  │
│  │                                                        │
│  ├─> Port Scanner (chaque 5 min)                        │
│  │   └─> Vérifier ports ouverts                         │
│  │       • Services actifs                              │
│  │       • Vulnérabilités potentielles                  │
│  │                                                        │
│  └─> Bandwidth Monitor                                   │
│      └─> Analyser trafic réseau                         │
│          • Top talkers                                   │
│          • Protocol distribution                         │
│          • Anomalies                                     │
└──────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  Stockage Métriques                                      │
│  ├─> Prometheus (time-series)                           │
│  ├─> MongoDB (événements)                               │
│  └─> InfluxDB (optionnel, pour grande échelle)         │
└──────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  Alerting                                                │
│  └─> Si metric > threshold:                             │
│      • Socket.IO → Dashboard real-time                  │
│      • Email/SMS → Admin                                │
│      • Créer IT Ticket automatique                      │
│      • Log dans audit_logs                              │
└──────────────────────────────────────────────────────────┘
```

### Modèle Network Device

```typescript
// backend/src/models/NetworkDevice.ts
const NetworkDeviceSchema = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  // Identification
  name: String,
  type: {
    type: String,
    enum: ["router", "switch", "firewall", "access_point", "gateway"],
  },

  // Réseau
  ipAddress: {
    type: String,
    required: true,
  },
  macAddress: String,
  hostname: String,
  managementIP: String,

  // SNMP
  snmpCommunity: String, // Encrypted
  snmpVersion: {
    type: String,
    enum: ["v1", "v2c", "v3"],
    default: "v2c",
  },

  // Informations device
  manufacturer: String, // Cisco, HP, Juniper, etc.
  model: String,
  firmwareVersion: String,
  serialNumber: String,

  // Ports/Interfaces
  interfaces: [
    {
      name: String, // GigabitEthernet0/1
      status: String, // up/down
      speed: Number, // Mbps
      duplex: String, // full/half
      vlan: Number,
      connectedTo: String,
      inOctets: Number,
      outOctets: Number,
      errors: Number,
    },
  ],

  // VLANs configurés
  vlans: [
    {
      id: Number,
      name: String,
      subnet: String,
    },
  ],

  // Monitoring
  monitoringEnabled: Boolean,
  pingEnabled: Boolean,
  snmpEnabled: Boolean,

  // Métriques actuelles
  currentMetrics: {
    cpuUsage: Number, // %
    memoryUsage: Number, // %
    temperature: Number, // °C
    uptime: Number, // secondes
    lastSeen: Date,
    isOnline: Boolean,
  },

  // Configuration
  configuration: {
    backupEnabled: Boolean,
    lastBackup: Date,
    configFile: String, // Encrypted
  },

  // Localisation
  location: {
    building: String,
    floor: String,
    rack: String,
  },

  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.model("NetworkDevice", NetworkDeviceSchema);
```

### Service de Monitoring

```typescript
// backend/src/services/networkMonitoringService.ts
import snmp from "net-snmp";
import ping from "ping";

class NetworkMonitoringService {
  private snmpSessions: Map<string, any> = new Map();

  // Créer session SNMP
  createSNMPSession(device: any) {
    const session = snmp.createSession(
      device.ipAddress,
      device.snmpCommunity || "public",
      { version: snmp.Version2c },
    );
    this.snmpSessions.set(device.ipAddress, session);
    return session;
  }

  // Récupérer CPU usage via SNMP
  async getCPUUsage(device: any): Promise<number> {
    const session =
      this.snmpSessions.get(device.ipAddress) || this.createSNMPSession(device);
    const oid = "1.3.6.1.4.1.9.2.1.56.0"; // Cisco CPU 5min average

    return new Promise((resolve, reject) => {
      session.get([oid], (error, varbinds) => {
        if (error) {
          reject(error);
        } else {
          resolve(varbinds[0].value);
        }
      });
    });
  }

  // Récupérer interfaces statistics
  async getInterfaceStats(device: any): Promise<any[]> {
    const session =
      this.snmpSessions.get(device.ipAddress) || this.createSNMPSession(device);

    // OIDs standards IF-MIB
    const ifDescr = "1.3.6.1.2.1.2.2.1.2"; // Interface description
    const ifOperStatus = "1.3.6.1.2.1.2.2.1.8"; // Operational status
    const ifInOctets = "1.3.6.1.2.1.2.2.1.10"; // Bytes in
    const ifOutOctets = "1.3.6.1.2.1.2.2.1.16"; // Bytes out

    // Walk SNMP table
    // Implementation détaillée...
    return [];
  }

  // Ping monitoring
  async pingDevice(ipAddress: string): Promise<{
    alive: boolean;
    latency: number;
    packetLoss: number;
  }> {
    const result = await ping.promise.probe(ipAddress, {
      timeout: 5,
      extra: ["-c", "4"], // 4 pings
    });

    return {
      alive: result.alive,
      latency: parseFloat(result.avg),
      packetLoss: parseFloat(result.packetLoss),
    };
  }

  // Monitorer tous les devices
  async monitorAllDevices(organizationId: string): Promise<void> {
    const devices = await NetworkDevice.find({
      organizationId,
      monitoringEnabled: true,
    });

    for (const device of devices) {
      try {
        // Ping
        if (device.pingEnabled) {
          const pingResult = await this.pingDevice(device.ipAddress);

          device.currentMetrics.isOnline = pingResult.alive;
          device.currentMetrics.lastSeen = new Date();

          if (!pingResult.alive) {
            // Créer alerte
            await this.createAlert({
              organizationId,
              type: "device_offline",
              severity: "high",
              message: `Device ${device.name} (${device.ipAddress}) is offline`,
              deviceId: device._id,
            });
          }
        }

        // SNMP
        if (device.snmpEnabled) {
          const cpuUsage = await this.getCPUUsage(device);
          device.currentMetrics.cpuUsage = cpuUsage;

          if (cpuUsage > 90) {
            await this.createAlert({
              organizationId,
              type: "high_cpu",
              severity: "medium",
              message: `High CPU usage on ${device.name}: ${cpuUsage}%`,
              deviceId: device._id,
            });
          }
        }

        await device.save();
      } catch (error) {
        console.error(`Monitoring failed for ${device.name}:`, error);
      }
    }
  }

  // Créer alerte
  async createAlert(alertData: any): Promise<void> {
    // Sauvegarder dans MongoDB
    await NetworkAlert.create(alertData);

    // Envoyer notification temps réel
    notificationService.broadcast({
      type: "network_alert",
      severity: alertData.severity,
      message: alertData.message,
      targetOrg: alertData.organizationId,
    });

    // Si critique, créer ticket IT automatique
    if (alertData.severity === "high" || alertData.severity === "critical") {
      await ITTicket.create({
        organizationId: alertData.organizationId,
        title: `Network Alert: ${alertData.message}`,
        description: `Automatic ticket created from monitoring alert`,
        priority: "urgent",
        category: "network",
        status: "nouveau",
        source: "auto_monitoring",
      });
    }
  }
}

export default NetworkMonitoringService;
```

---

## 🎫 Tickets IT (Helpdesk)

### Modèle IT Ticket

```typescript
// backend/src/models/ITTicket.ts
const ITTicketSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    // Identification
    ticketNumber: {
      type: String,
      unique: true,
      // Auto-généré: IT-2026-0001
    },
    title: String,
    description: String,

    // Classification
    category: {
      type: String,
      enum: [
        "hardware", // Problème matériel
        "software", // Problème logiciel
        "network", // Problème réseau
        "account", // Compte utilisateur/AD
        "email", // Email/Exchange
        "printing", // Impression
        "phone", // Téléphonie
        "security", // Sécurité/virus
        "other",
      ],
    },
    subcategory: String,

    // Priorité & SLA
    priority: {
      type: String,
      enum: ["basse", "moyenne", "haute", "urgente", "critique"],
      default: "moyenne",
    },
    impact: {
      type: String,
      enum: ["low", "medium", "high"], // Impact sur business
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
    },

    // SLA
    sla: {
      responseTime: Number, // minutes
      resolutionTime: Number, // minutes
      responseDeadline: Date,
      resolutionDeadline: Date,
      breached: Boolean,
    },

    // Parties impliquées
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTeam: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },

    // Asset concerné
    relatedAsset: {
      type: Schema.Types.ObjectId,
      ref: "ITAsset",
    },

    // Workflow
    status: {
      type: String,
      enum: [
        "nouveau",
        "assigné",
        "en_cours",
        "en_attente", // Waiting on user/vendor
        "résolu",
        "fermé",
        "annulé",
      ],
      default: "nouveau",
    },

    // Timeline
    createdAt: Date,
    firstResponseAt: Date,
    assignedAt: Date,
    resolvedAt: Date,
    closedAt: Date,

    // Résolution
    resolution: {
      summary: String,
      rootCause: String,
      solution: String,
      preventiveMeasures: String,
    },

    // Communication
    updates: [
      {
        timestamp: Date,
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        message: String,
        internal: Boolean, // Visible seulement aux agents
        attachments: [String],
      },
    ],

    // Attachments
    attachments: [
      {
        filename: String,
        url: String,
        uploadedBy: Schema.Types.ObjectId,
        uploadedAt: Date,
      },
    ],

    // Escalation
    escalated: Boolean,
    escalatedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    escalatedAt: Date,

    // Satisfaction
    satisfaction: {
      rating: Number, // 1-5
      comment: String,
      submittedAt: Date,
    },

    // Coûts
    estimatedCost: Number,
    actualCost: Number,
    laborHours: Number,

    // Tags & recherche
    tags: [String],

    // Source
    source: {
      type: String,
      enum: ["web", "email", "phone", "chat", "auto_monitoring"],
      default: "web",
    },

    updatedAt: Date,
  },
  {
    timestamps: true,
  },
);

// Auto-générer ticketNumber
ITTicketSchema.pre("save", async function (next) {
  if (this.isNew && !this.ticketNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      organizationId: this.organizationId,
      createdAt: { $gte: new Date(year, 0, 1) },
    });
    this.ticketNumber = `IT-${year}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Calculer SLA
ITTicketSchema.pre("save", function (next) {
  if (this.isNew) {
    // SLA basé sur priorité
    const slaMatrix = {
      critique: { response: 15, resolution: 240 }, // 15min, 4h
      urgente: { response: 30, resolution: 480 }, // 30min, 8h
      haute: { response: 120, resolution: 1440 }, // 2h, 24h
      moyenne: { response: 480, resolution: 4320 }, // 8h, 3 days
      basse: { response: 1440, resolution: 10080 }, // 24h, 7 days
    };

    const sla = slaMatrix[this.priority];
    this.sla.responseTime = sla.response;
    this.sla.resolutionTime = sla.resolution;
    this.sla.responseDeadline = new Date(Date.now() + sla.response * 60000);
    this.sla.resolutionDeadline = new Date(Date.now() + sla.resolution * 60000);
  }
  next();
});

export default mongoose.model("ITTicket", ITTicketSchema);
```

### Intelligence Automatique

```typescript
// backend/src/services/itTicketIntelligenceService.ts
class ITTicketIntelligenceService {
  // Auto-categorisation avec ML (simple version)
  async categor Human: continue
```
