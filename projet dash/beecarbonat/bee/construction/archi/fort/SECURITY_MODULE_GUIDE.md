# 🛡️ ReclamTrack Security Module - Complete Guide

## 📋 Overview

The Security Module provides comprehensive security monitoring and management capabilities, including:

- **Password Security Audit** - Bcrypt verification & rotation tracking
- **RDP Access Monitoring** - Track remote desktop sessions
- **GPMC Management** - Group Policy management via PowerShell
- **Firewall Integration** - pfSense monitoring (coming soon)

---

## 🔐 1. Password Security

### Features

✅ Bcrypt hashing verification (OWASP compliant)  
✅ Password age tracking (90-day rotation policy)  
✅ Weak password detection  
✅ Compliance scoring

### API Endpoint

```http
GET /api/security/audit/passwords
Authorization: Bearer {token}
x-organization-id: {organizationId}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 156,
    "bcryptHashed": 156,
    "weakPasswords": 0,
    "rotationNeeded": 12,
    "lastAudit": "2026-02-17T14:00:00Z"
  }
}
```

### Implementation Details

All passwords are hashed using **bcrypt** with 10 salt rounds:

```typescript
import bcrypt from "bcrypt";
const hashedPassword = await bcrypt.hash(plainPassword, 10);
```

Passwords are verified by checking if they start with `$2a$`, `$2b$`, or `$2y$` (bcrypt prefixes).

---

## 🖥️ 2. RDP Access Monitoring

### Features

✅ Real-time RDP session tracking  
✅ Connection history  
✅ IP address logging

### API Endpoint

```http
GET /api/security/sessions/rdp
Authorization: Bearer {token}
x-organization-id: {organizationId}
```

### PowerShell Command Used

```powershell
qwinsta /server:localhost
```

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "sessionName": "rdp-tcp#1",
      "username": "admin@domain.local",
      "id": "2",
      "state": "Actif",
      "type": "RDP"
    }
  ]
}
```

---

## 📜 3. GPMC (Group Policy Management Console)

### Whitelisted PowerShell Scripts

The system only allows execution of pre-approved scripts for security.

#### Available Scripts:

### 3.1 Get GPO Report

```powershell
Get-GPOReport -All -ReportType Html -Path C:\GPOReports\report.html
```

**Purpose:** Generate comprehensive HTML report of all GPOs.

### 3.2 Sync AD Users

```powershell
Get-ADUser -Filter * | Export-Csv C:\Exports\users.csv
```

**Purpose:** Export all Active Directory users to CSV.

### 3.3 Check AD Replication

```powershell
Get-ADReplicationPartnerMetadata -Target * | Select-Object Server,Partner,LastReplicationSuccess
```

**Purpose:** Verify AD replication health across domain controllers.

### 3.4 Backup GPOs

```powershell
Backup-GPO -All -Path C:\GPOBackups
```

**Purpose:** Backup all Group Policy Objects to specified directory.

### API Endpoint

```http
POST /api/security/powershell
Authorization: Bearer {token}
x-organization-id: {organizationId}
Content-Type: application/json

{
  "scriptName": "Get-GPOReport"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "success": true,
    "output": "GPO Report generated successfully...",
    "scriptName": "Get-GPOReport"
  }
}
```

### Security Features

✅ **Whitelist-only execution** - Only pre-approved scripts can run  
✅ **Audit logging** - All executions logged with user, timestamp, and output  
✅ **Role-based access** - Only ADMIN/OWNER can execute scripts  
✅ **Error handling** - Script failures are logged and reported

---

## 📊 4. GPO List Retrieval

### API Endpoint

```http
GET /api/security/gpo
Authorization: Bearer {token}
x-organization-id: {organizationId}
```

### PowerShell Command

```powershell
Get-GPO -All | Select-Object DisplayName,GpoStatus,CreationTime,ModificationTime | ConvertTo-Json
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "DisplayName": "Default Domain Policy",
      "GpoStatus": "AllSettingsEnabled",
      "CreationTime": "2025-01-15T10:30:00Z",
      "ModificationTime": "2026-02-15T14:20:00Z"
    },
    {
      "DisplayName": "Security Baseline",
      "GpoStatus": "AllSettingsEnabled",
      "CreationTime": "2025-03-10T09:00:00Z",
      "ModificationTime": "2026-02-10T11:45:00Z"
    }
  ]
}
```

---

## 🔥 4. Firewall (pfSense) Integration

### Features

✅ **Real-time Traffic Monitoring** - Visualize IN/OUT throughput
✅ **Firewall Logs** - Live view of blocked/passed packets
✅ **System Health** - CPU, Memory, States statistics
✅ **Interface Status** - WAN/LAN/OPT interface monitoring

### API Endpoints

```http
POST /api/security/pfsense/connect     ← Connect (Host/API Key)
GET  /api/security/pfsense/rules       ← Get firewall rules
GET  /api/security/pfsense/logs        ← Get last 100 logs
GET  /api/security/pfsense/interfaces  ← Interface stats
GET  /api/security/pfsense/system      ← System health
GET  /api/security/pfsense/traffic     ← Traffic throughput
```

### 4.1 Connection Setup

In the Security Center > Firewall tab, click "Connect" and enter:

- **Host**: IP address or domain (e.g., `192.168.1.1`)
- **API Key**: pfSense API Token
- **API Secret**: pfSense API Secret

### 4.2 Traffic Monitoring

Displays real-time bandwidth usage for WAN interface (Mbps).

### 4.3 Logs

Shows the last 100 firewall events with:

- Action (Pass/Block)
- Interface
- Source/Destination IP
- Protocol

---

## 📈 5. Compliance Reporting

### API Endpoint

```http
GET /api/security/compliance
Authorization: Bearer {token}
x-organization-id: {organizationId}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "timestamp": "2026-02-17T14:00:00Z",
    "organizationId": "65f123...",
    "passwordSecurity": {
      "totalUsers": 156,
      "bcryptHashed": 156,
      "weakPasswords": 0,
      "rotationNeeded": 12
    },
    "activeSessions": 2,
    "gpoCount": 5,
    "complianceScore": 95,
    "recommendations": ["12 users need password rotation (>90 days old)"]
  }
}
```

### Compliance Score Calculation

```
Base Score: 100

Penalties:
- Non-bcrypt passwords: -50% of affected users
- Weak passwords: -30% of affected users
- Rotation needed: -20% of affected users

Final Score: Max(0, Base - Penalties)
```

---

## 🔒 6. RBAC Security

All security endpoints require:

1. Valid authentication (`auth` middleware)
2. Organization membership (`requireOrganization` middleware)
3. Admin or Owner role (`requireRole(['ADMIN', 'OWNER'])`)

### Role Hierarchy

- **OWNER** - Full access to all security features
- **ADMIN** - Full access to all security features
- **TECH_LEAD** - Read-only access (no PowerShell execution)
- **TECHNICIAN** - No access
- **MEMBER** - No access
- **VIEWER** - No access

---

## 🧪 7. Testing

### Test Password Audit

```bash
curl -X GET http://localhost:5000/api/security/audit/passwords \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-organization-id: YOUR_ORG_ID"
```

### Test PowerShell Execution

```bash
curl -X POST http://localhost:5000/api/security/powershell \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-organization-id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{"scriptName": "Get-GPOReport"}'
```

### Test RDP Monitoring

```bash
curl -X GET http://localhost:5000/api/security/sessions/rdp \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-organization-id: YOUR_ORG_ID"
```

---

## 📝 8. Additional PowerShell Scripts

Here are additional useful scripts you can add to the whitelist:

### Force GPUpdate on All Computers

```powershell
Get-ADComputer -Filter * | ForEach-Object {
    Invoke-GPUpdate -Computer $_.Name -Force
}
```

### Get Password Policy

```powershell
Get-ADDefaultDomainPasswordPolicy | Select-Object MinPasswordLength,PasswordHistoryCount,MaxPasswordAge
```

### List Locked Out Users

```powershell
Search-ADAccount -LockedOut | Select-Object Name,SAMAccountName,LockedOut,LastLogonDate
```

### Get Failed Login Attempts

```powershell
Get-EventLog -LogName Security -InstanceId 4625 -Newest 100 |
    Select-Object TimeGenerated,Message
```

### Export GPO Settings

```powershell
Get-GPO -All | ForEach-Object {
    Get-GPOReport -Name $_.DisplayName -ReportType Xml -Path "C:\GPOSettings\$($_.DisplayName).xml"
}
```

---

## 🚀 9. Frontend Integration

Access the Security Center at:

```
http://localhost:3000/admin/security
```

### Features

- 🔐 Password Security Dashboard
- 🖥️ RDP Session Monitor
- 📜 GPO Management Console
- 🛡️ Firewall Status (pfSense integration coming soon)

---

## 📌 10. Environment Setup

### Required Permissions (Windows Server)

1. **Active Directory Module** - Install RSAT tools

```powershell
Install-WindowsFeature RSAT-AD-PowerShell
```

2. **Group Policy Module**

```powershell
Install-WindowsFeature GPMC
```

3. **Execution Policy**

```powershell
Set-ExecutionPolicy RemoteSigned -Scope LocalMachine
```

### For Development (Non-Windows)

The service gracefully handles missing PowerShell commands and returns mock data.

---

**Date:** 2026-02-17  
**Version:** 1.0  
**Status:** ✅ Production Ready
