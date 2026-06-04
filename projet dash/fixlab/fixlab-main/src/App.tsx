/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  FolderHeart, Network, ShieldCheck, Terminal as TermIcon, BrainCircuit, 
  Workflow, Layers, Server, Activity, AlertOctagon, RefreshCw, 
  Settings2, Bot, Menu, X, Hammer, Globe, Mail, Landmark,
  Sun, Moon, ClipboardCheck, Monitor, Sliders, Settings, ShieldAlert,
  Users, LogOut
} from "lucide-react";

import { Device, SystemLog, SecurityPolicy, GroupFolder, SoftwarePackage, PredictiveFailure, DNSRecord, DNSQueryLog, SovereignSettings } from "./types";
import { 
  initialDevices, initialLogs, initialPolicies, initialGroups, 
  initialSoftware, initialPredictiveFailures 
} from "./mockData";

// Firebase/Firestore Cloud imports
import { onAuthStateChanged, User } from "firebase/auth";
import { 
  collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, getDoc
} from "firebase/firestore";
import { db, auth, OperationType, handleFirestoreError, testConnection } from "./utils/firebaseDb";
import { logout } from "./utils/firebaseAuth";
import { SovereignAuthGate } from "./components/SovereignAuthGate";

// Components
import { SystemStatusBar } from "./components/SystemStatusBar";
import { RightFocusPanel } from "./components/RightFocusPanel";
import { DashboardView } from "./components/DashboardView";
import { DevicesView } from "./components/DevicesView";
import { PoliciesView } from "./components/PoliciesView";
import { GroupsView } from "./components/GroupsView";
import { ConsoleView } from "./components/ConsoleView";
import { SoftwareView } from "./components/SoftwareView";
import { PredictiveView } from "./components/PredictiveView";
import { AutomationView } from "./components/AutomationView";
import { DNSView } from "./components/DNSView";
import { CommandCenterPage } from "./components/CommandCenterPage";
import { SettingsPage } from "./components/SettingsPage";
import { SovereignGmail } from "./components/SovereignGmail";

// Dynamic Variant Layouts Custom Components
import { IncidentTimeline } from "./components/IncidentTimeline";
import { RemoteTerminal } from "./components/RemoteTerminal";
import { HealthMatrix } from "./components/HealthMatrix";
import { GlobalHorizonMap } from "./components/GlobalHorizonMap";
import { QuantumNode } from "./components/QuantumNode";
import { VisionArchitecte } from "./components/VisionArchitecte";
import { SecurityPerimeter } from "./components/SecurityPerimeter";
import { DataVisualizationFlow } from "./components/DataVisualizationFlow";
import { PlatformHypervisor } from "./components/PlatformHypervisor";
import { SovereignAudit } from "./components/SovereignAudit";
import { ObservationDeck } from "./components/ObservationDeck";
import { ApplianceCore } from "./components/ApplianceCore";
import { AssetEnrollment } from "./components/AssetEnrollment";
import { ClientDashboard } from "./components/ClientDashboard";
import { SovereignContacts } from "./components/SovereignContacts";
import { PublicLanding, NeuralHandshake, SovereignPricingPage } from "./components/SovereignLifecycleOrchestrator";
import { useTranslation } from "./hooks/useTranslation";

// Private custom hook that monitors system logs and notifies when a critical incident is registered
function useSecurityAlertListener(
  logs: SystemLog[],
  onTriggerDraft: (draft: { to: string; subject: string; body: string }) => void
) {
  const [processedAlertIds, setProcessedAlertIds] = useState<Set<string>>(() => {
    // Collect pre-existing logs on mount to ensure we only trigger on newly registered/streamed events
    return new Set(logs.filter(log => log.level === "critical").map(log => log.id));
  });

  useEffect(() => {
    const criticalLogs = logs.filter(log => log.level === "critical");
    if (criticalLogs.length === 0) return;

    // Filter out previously handled incident reports
    const unprocessed = criticalLogs.filter(log => !processedAlertIds.has(log.id));
    if (unprocessed.length === 0) return;

    // Grab the newest unhandled critical alarm
    const newestLog = unprocessed[0];

    const trackingSubject = `[CRITICAL SECURITY ALERT] ${newestLog.source}: Core Vulnerability Spotted`;
    const draftMessage = `SECURE COMMUNICATIONS NETWAY
=====================================
TIMESTAMP RE-LINK: ${newestLog.timestamp}
DETECTION DECK: ${newestLog.source}
SEVERITY MATRIX: CRITICAL

INCIDENT TELEMETRY PAYLOAD:
"${newestLog.message}"

This alert has been cryptographically registered and requires urgent security quarantine procedures or operator intervention.

Best regards,
Sovereign Network Command Center`;

    onTriggerDraft({
      to: "adambeniich7@gmail.com",
      subject: trackingSubject,
      body: draftMessage
    });

    setProcessedAlertIds(prev => {
      const next = new Set(prev);
      next.add(newestLog.id);
      return next;
    });
  }, [logs, processedAlertIds, onTriggerDraft]);
}

export default function App() {
  const { t, lang, setLang } = useTranslation();
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "light";
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
    if (isLightMode) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [isLightMode]);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [policies, setPolicies] = useState<SecurityPolicy[]>(initialPolicies);
  const [groups, setGroups] = useState<GroupFolder[]>(initialGroups);
  const [software, setSoftware] = useState<SoftwarePackage[]>(initialSoftware);
  const [failures, setFailures] = useState<PredictiveFailure[]>(initialPredictiveFailures);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [dnsQueryLogs, setDnsQueryLogs] = useState<DNSQueryLog[]>([]);
  const [sovereignSettings, setSovereignSettings] = useState<SovereignSettings>({
    coreIdentity: 45,
    cognitiveLoad: 60,
    hapticResonance: 30,
    energyProfile: 75,
    dataSynthesis: "Low-Latency"
  });

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [compliance, setCompliance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("insights");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<"super-admin" | "strategist" | "tactician" | "auditor" | "client">("super-admin");
  const [currentPlan, setCurrentPlan] = useState<"tactical" | "sovereign" | "imperial">("sovereign");

  useEffect(() => {
    if (currentRole === "client") {
      setActiveTab("client-dashboard");
    } else if (activeTab === "client-dashboard") {
      setActiveTab("dashboard");
    }
  }, [currentRole]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [lifecycleState, setLifecycleState] = useState<"landing" | "auth" | "handshake" | "pricing" | "dashboard">("dashboard");

  // Multi-state automatic redirection to handshake on active sessions
  useEffect(() => {
    if (currentUser && (lifecycleState === "landing" || lifecycleState === "auth")) {
      setLifecycleState("handshake");
    }
  }, [currentUser, lifecycleState]);

  // Buffer state to transport custom pre-populated draft templates dynamically to SovereignGmail views
  const [gmailInitialCompose, setGmailInitialCompose] = useState<{
    to: string;
    subject: string;
    body: string;
  } | null>(null);

  // Listen to security logs and auto-compose drafts when critical alerts arise
  useSecurityAlertListener(logs, (draft) => {
    setGmailInitialCompose(draft);
    setActiveTab("gmail");
  });

  // Resolve current active selected device from live telemetry array to prevent state drift
  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || null;

  // 1. Connection-first Diagnostics boot check
  useEffect(() => {
    testConnection().then(active => {
      if (active) {
        console.info("⚡ Sovereign Nexus authenticated secure link validated successfully.");
      } else {
        console.warn("⚠️ Sovereign database link running in localized/airgapped fallback segment.");
      }
    });
  }, []);

  // 2. Listen to Firebase Auth state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser) {
        console.info(`🔑 Secure operator session verified for email: ${fbUser.email}`);
        
        const userDocRef = doc(db, "users", fbUser.uid);
        try {
          // Check if root user profile exists
          const uDoc = await getDoc(userDocRef);
          
          if (!uDoc.exists()) {
            console.info("🚀 User profile missing. Creating standard profile record...");
            await setDoc(userDocRef, {
              uid: fbUser.uid,
              email: fbUser.email,
              role: currentRole === "client" ? "client" : "super-admin",
              plan: currentRole === "client" ? "tactical" : "sovereign",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          } else {
            const uData = uDoc.data();
            if (uData?.role) setCurrentRole(uData.role as any);
            if (uData?.plan) setCurrentPlan(uData.plan as any);
          }

          // Check if devices exist under the user
          const testSnap = await getDocs(collection(db, `users/${fbUser.uid}/devices`));
          
          if (testSnap.empty) {
            console.info("🚀 Subcollections missing. Syncing secure, isolated mock datasets...");
            const batch = writeBatch(db);
            
            // Sync original device nodes
            initialDevices.forEach(d => {
              const dRef = doc(db, `users/${fbUser.uid}/devices`, d.id);
              batch.set(dRef, { ...d, ownerId: fbUser.uid });
            });

            // Sync original security policies
            initialPolicies.forEach(p => {
              const pRef = doc(db, `users/${fbUser.uid}/securityPolicies`, p.id);
              batch.set(pRef, { ...p, ownerId: fbUser.uid });
            });

            // Sync original log matrices
            initialLogs.forEach(l => {
              const lRef = doc(db, `users/${fbUser.uid}/systemLogs`, l.id);
              batch.set(lRef, { ...l, ownerId: fbUser.uid });
            });

            // Sync original groups
            initialGroups.forEach(g => {
              const gRef = doc(db, `users/${fbUser.uid}/groupFolders`, g.id);
              batch.set(gRef, { ...g, ownerId: fbUser.uid });
            });

            await batch.commit();
            console.info("🎉 Subcollections database initialized under strict zero-trust.");
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          if (errMsg.toLowerCase().includes("offline") || errMsg.toLowerCase().includes("network")) {
            console.warn("Sovereign Offline Fallback Active. Failed to sync client onboarding data:", err);
          } else {
            console.error("Failed to sync client onboarding data:", err);
          }
        }
      } else {
        console.info("ℹ️ Localized session initialized. Real-time stream fallbacks triggered.");
        setLifecycleState("dashboard");
      }
      setIsAuthChecked(true);
    });

    return () => unsubAuth();
  }, [currentRole]);

  // 3. Listen to Firestore real-time collections if user is logged in
  useEffect(() => {
    if (!currentUser) return;

    const uId = currentUser.uid;

    // Sub to User Profile for instant RBAC/Plan reflects
    const unsubProfile = onSnapshot(doc(db, "users", uId), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        if (d?.role) setCurrentRole(d.role as any);
        if (d?.plan) setCurrentPlan(d.plan as any);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${uId}`);
    });

    // Sub to Devices
    const unsubDevices = onSnapshot(collection(db, `users/${uId}/devices`), (snapshot) => {
      const items: Device[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Device);
      });
      if (items.length > 0) {
        setDevices(items);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uId}/devices`);
    });

    // Sub to Policies
    const unsubPolicies = onSnapshot(collection(db, `users/${uId}/securityPolicies`), (snapshot) => {
      const items: SecurityPolicy[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as SecurityPolicy);
      });
      if (items.length > 0) {
        setPolicies(items);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uId}/securityPolicies`);
    });

    // Sub to Logs
    const unsubLogs = onSnapshot(collection(db, `users/${uId}/systemLogs`), (snapshot) => {
      const items: SystemLog[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as SystemLog);
      });
      if (items.length > 0) {
        setLogs(items);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uId}/systemLogs`);
    });

    // Sub to Groups
    const unsubGroups = onSnapshot(collection(db, `users/${uId}/groupFolders`), (snapshot) => {
      const items: GroupFolder[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as GroupFolder);
      });
      if (items.length > 0) {
        setGroups(items);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uId}/groupFolders`);
    });

    return () => {
      unsubProfile();
      unsubDevices();
      unsubPolicies();
      unsubLogs();
      unsubGroups();
    };
  }, [currentUser]);

  // 4. Real-Time SSE Stream Fallback (Gated when currentUser is offline/anonymous)
  useEffect(() => {
    if (currentUser) return; // Ignore SSE streaming updates if logged in to Firestore

    const sse = new EventSource("/api/events");

    sse.addEventListener("sync_all", (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.devices) setDevices(payload.devices);
        if (payload.policies) setPolicies(payload.policies);
        if (payload.logs) setLogs(payload.logs);
        if (payload.software) setSoftware(payload.software);
        if (payload.failures) setFailures(payload.failures);
        if (payload.dnsRecords) setDnsRecords(payload.dnsRecords);
        if (payload.dnsQueryLogs) setDnsQueryLogs(payload.dnsQueryLogs);
        if (payload.sovereignSettings) setSovereignSettings(payload.sovereignSettings);
        if (payload.compliance) setCompliance(payload.compliance);
        window.dispatchEvent(new CustomEvent("sse_sync_all"));
      } catch (err) {
        console.error("SSE initial sync failed:", err);
      }
    });

    sse.addEventListener("enrollment_requests_update", (e: MessageEvent) => {
      window.dispatchEvent(new CustomEvent("sse_enrollment_requests_update"));
    });

    sse.addEventListener("devices_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setDevices(updated);
      } catch (err) {
        console.error("SSE devices update failed:", err);
      }
    });

    sse.addEventListener("policies_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setPolicies(updated);
      } catch (err) {
        console.error("SSE policies update failed:", err);
      }
    });

    sse.addEventListener("logs_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setLogs(updated);
      } catch (err) {
        console.error("SSE logs update failed:", err);
      }
    });

    sse.addEventListener("software_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setSoftware(updated);
      } catch (err) {
        console.error("SSE software update failed:", err);
      }
    });

    sse.addEventListener("failures_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setFailures(updated);
      } catch (err) {
        console.error("SSE predictions update failed:", err);
      }
    });

    sse.addEventListener("dns_records_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setDnsRecords(updated);
      } catch (err) {
        console.error("SSE dns records update failed:", err);
      }
    });

    sse.addEventListener("dns_logs_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setDnsQueryLogs(updated);
      } catch (err) {
        console.error("SSE dns logs update failed:", err);
      }
    });

    sse.addEventListener("settings_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setSovereignSettings(updated);
      } catch (err) {
        console.error("SSE settings update failed:", err);
      }
    });

    sse.addEventListener("compliance_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setCompliance(updated);
      } catch (err) {
        console.error("SSE compliance update failed:", err);
      }
    });

    sse.onerror = (err) => {
      console.warn("Real-time stream interrupted. Re-negotiating SSL link socket...", err);
    };

    return () => {
      sse.close();
    };
  }, [currentUser]);

  // Sync group scores with underlying device compliance averages
  useEffect(() => {
    setGroups(prev => prev.map(grp => {
      const gDevices = devices.filter(d => d.group === grp.name);
      if (gDevices.length === 0) return grp;
      
      const avgCompliance = Math.round(
        gDevices.reduce((sum, d) => sum + d.policyCompliance, 0) / gDevices.length
      );
      const warns = gDevices.filter(d => d.status === "warning").length;

      return {
        ...grp,
        healthScore: avgCompliance,
        activeThreats: warns
      };
    }));
  }, [devices]);

  // Handle manual additions or injections Locally or in Firestore
  const handleAddLog = (newLog: SystemLog) => {
    if (currentUser) {
      const docRef = doc(db, `users/${currentUser.uid}/systemLogs`, newLog.id);
      setDoc(docRef, { ...newLog, ownerId: currentUser.uid }).catch(err => 
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/systemLogs/${newLog.id}`)
      );
    } else {
      setLogs(prev => [newLog, ...prev]);
    }
  };

  // State update handles for subscription role & plan
  const handleUpdateRole = async (newRole: "super-admin" | "strategist" | "tactician" | "auditor" | "client") => {
    setCurrentRole(newRole);
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      try {
        await setDoc(docRef, { role: newRole, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    }
  };

  const handleUpdatePlan = async (newPlan: "tactical" | "sovereign" | "imperial") => {
    setCurrentPlan(newPlan);
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      try {
        await setDoc(docRef, { plan: newPlan, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    }
  };

  // Dispatch live actions directly to server-side endpoints
  const handleActionTriggered = async (
    actionName: string, 
    deviceId: string, 
    level: "info" | "warning" | "critical" | "success"
  ) => {
    if (actionName === "OPEN_REMOTE_TERMINAL" || actionName.includes("Tether") || actionName.includes("TERMINAL TETHER")) {
      setActiveTab("terminal");
      setSelectedDeviceId(null); // Close sidebar for full width terminal view
      return;
    }

    let apiAction = "";
    if (actionName.includes("Manual Hard Reboot Requested") || actionName === "reboot") {
      apiAction = "reboot";
    } else if (actionName.includes("Cyber-Security Isolation Triggered") || actionName === "isolate") {
      apiAction = "isolate";
    } else if (actionName.includes("Cryptographic Policy Force Enforced") || actionName === "clear-alarms") {
      apiAction = "clear-alarms";
    }

    if (currentUser) {
      // Modify device and log in Firestore
      const dev = devices.find(d => d.id === deviceId);
      if (dev) {
        const devRef = doc(db, `users/${currentUser.uid}/devices`, deviceId);
        let newStatus = dev.status;
        let newCpu = dev.cpu;
        let newRam = dev.ram;

        if (apiAction === "reboot") {
          newStatus = "online";
          newCpu = 10;
          newRam = 20;
        } else if (apiAction === "isolate") {
          newStatus = "warning";
        }

        try {
          await updateDoc(devRef, { status: newStatus, cpu: newCpu, ram: newRam, lastActive: "Just now" });
          
          // Add custom log
          const newLog: SystemLog = {
            id: `LOG-REAC-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
            source: "Console Interactive",
            level: level || "info",
            message: `Instruction '${apiAction || actionName}' executed on device ${dev.name} via platform gateway.`
          };
          handleAddLog(newLog);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/devices/${deviceId}`);
        }
      }
    } else {
      // Falling back to Local/SSE API server integrations:
      if (apiAction) {
        try {
          await fetch("/api/devices/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deviceId, action: apiAction })
          });
        } catch (err) {
          console.error("Failed to invoke device command API:", err);
        }
      } else if (actionName.includes("Diagnostic Port Stream Synced")) {
        const newLog: SystemLog = {
          id: `LOG-TETH-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
          source: "Console Interactive",
          level: "info",
          message: `Tether secure socket tunnel synced successfully for host device ID: ${deviceId}`
        };
        setLogs(prev => [newLog, ...prev]);
      }
    }
  };

  const handleClearAlert = (logId: string) => {
    if (currentUser) {
      const docRef = doc(db, `users/${currentUser.uid}/systemLogs`, logId);
      deleteDoc(docRef).catch(err =>
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/systemLogs/${logId}`)
      );
    } else {
      setLogs(prev => prev.filter(l => l.id !== logId));
    }
  };

  const handleModifyDeviceStatus = async (deviceId: string, status: "online" | "warning" | "offline") => {
    if (currentUser) {
      const devRef = doc(db, `users/${currentUser.uid}/devices`, deviceId);
      try {
        await updateDoc(devRef, { status });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/devices/${deviceId}`);
      }
    } else {
      const apiAction = status === "online" ? "reboot" : status === "warning" ? "isolate" : "";
      if (apiAction) {
        try {
          await fetch("/api/devices/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deviceId, action: apiAction })
          });
        } catch (err) {
          console.error("Failed to update status via command API:", err);
        }
      }
    }
  };

  // Toggle Security Policy on Server or in Firestore
  const handleTogglePolicy = async (policyId: string) => {
    if (currentRole === "auditor") {
      console.warn("Write lock active: Policies cannot be modified during active Auditor session.");
      return;
    }
    const policy = policies.find(p => p.id === policyId);
    if (policy && currentUser) {
      const docRef = doc(db, `users/${currentUser.uid}/securityPolicies`, policyId);
      try {
        await updateDoc(docRef, { enabled: !policy.enabled, lastEnforced: "Just now" });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/securityPolicies/${policyId}`);
      }
    } else {
      try {
        await fetch("/api/policies/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ policyId })
        });
      } catch (err) {
        console.error("Failed to toggle policy via API:", err);
      }
    }
  };

  // Mass Rollout Sovereign Desired State
  const handleDeployPoliciesAll = async () => {
    if (currentRole === "auditor") {
      console.warn("Write lock active: Global deploy disabled for Auditor sessions.");
      return;
    }
    if (currentUser) {
      try {
        for (const p of policies) {
          const docRef = doc(db, `users/${currentUser.uid}/securityPolicies`, p.id);
          await updateDoc(docRef, { enabled: true, lastEnforced: "Just now" });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/securityPolicies`);
      }
    } else {
      try {
        await fetch("/api/policies/deploy", { method: "POST" });
      } catch (err) {
        console.error("Failed to post global policy rollout via API:", err);
      }
    }
  };

  // Flash Kernel Software Update
  const handleTriggerSoftwareUpdate = async (pkgId: string) => {
    try {
      await fetch("/api/software/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pkgId })
      });
    } catch (err) {
      console.error("Failed to trigger packages flash via API:", err);
    }
  };

  // Mitigate ML Degradation Alerts
  const handleTriggerPredictionMitigation = async (failureId: string) => {
    try {
      await fetch("/api/failures/mitigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ failureId })
      });
    } catch (err) {
      console.error("Failed to trigger ML failure mitigation via API:", err);
    }
  };

  // Sovereign DNS API wrappers
  const handleAddDNSRecord = async (domain: string, type: DNSRecord["type"], value: string, ttl: number) => {
    try {
      await fetch("/api/dns/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, type, value, ttl })
      });
    } catch (err) {
      console.error("Failed to add DNS record:", err);
    }
  };

  const handleToggleDNSRecord = async (recordId: string) => {
    try {
      await fetch("/api/dns/records/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId })
      });
    } catch (err) {
      console.error("Failed to toggle DNS record:", err);
    }
  };

  const handlePurgeDNSRecord = async (recordId: string) => {
    try {
      await fetch("/api/dns/records/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId })
      });
    } catch (err) {
      console.error("Failed to purge DNS record:", err);
    }
  };

  const handleTriggerDiagnosticsDNSQuery = async (domain: string, deviceId: string) => {
    try {
      await fetch("/api/dns/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, deviceId })
      });
    } catch (err) {
      console.error("Failed to dispatch manual diagnostics lookup query:", err);
    }
  };

  const handleApplySovereignSettings = async (newSecSettings: SovereignSettings) => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSecSettings)
      });
    } catch (err) {
      console.error("Failed to post settings update to API:", err);
    }
  };

  // Navigations Lists with dynamic, adaptive contextual UI modes (Discord-style)
  const navigationTabs = currentRole === "client" ? [
    { id: "client-dashboard", label: t("tabs.client-dashboard"), icon: Server },
    { id: "gmail", label: t("tabs.gmail"), icon: Mail },
    { id: "platform-gate", label: t("tabs.platform-gate"), icon: Landmark },
    { id: "contacts", label: t("tabs.contacts"), icon: Users }
  ] : [
    { id: "dashboard", label: t("tabs.dashboard"), icon: Server },
    { id: "health-matrix", label: t("tabs.health-matrix"), icon: Activity },
    { id: "data-flow", label: t("tabs.data-flow"), icon: Workflow },
    { id: "quantum-node", label: t("tabs.quantum-node"), icon: BrainCircuit },
    { id: "insights", label: t("tabs.insights"), icon: Layers },
    { id: "perimeter", label: t("tabs.perimeter"), icon: ShieldCheck },
    { id: "terminal", label: t("tabs.terminal"), icon: TermIcon },
    { id: "timeline", label: t("tabs.timeline"), icon: AlertOctagon },
    { id: "global-map", label: t("tabs.global-map"), icon: Globe },
    { id: "settings", label: t("tabs.settings"), icon: Settings2 },
    { id: "gmail", label: t("tabs.gmail"), icon: Mail },
    { id: "platform-gate", label: t("tabs.platform-gate"), icon: Landmark },
    { id: "sovereign-audit", label: t("tabs.sovereign-audit"), icon: ClipboardCheck },
    { id: "observation-deck", label: t("tabs.observation-deck"), icon: Monitor },
    { id: "appliance-core", label: t("tabs.appliance-core"), icon: Sliders },
    { id: "asset-enrollment", label: t("tabs.asset-enrollment"), icon: ShieldAlert },
    { id: "contacts", label: t("tabs.contacts"), icon: Users }
  ];

  if (!isAuthChecked) {
    return (
      <div id="sovereign-initial-handshake" className="min-h-screen w-full flex flex-col justify-center items-center bg-[#0a041f] text-cyan-400 font-mono space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="text-[10px] font-bold tracking-widest uppercase">Initializing Secure mTLS Handshake...</span>
      </div>
    );
  }

  // Sovereign User Lifecycle Orchestration Funnel
  if (lifecycleState === "landing" && !currentUser) {
    return (
      <PublicLanding 
        onInitiateLogin={() => setLifecycleState("auth")}
        onInitiateRegister={() => setLifecycleState("auth")}
      />
    );
  }

  if (lifecycleState === "auth" && !currentUser) {
    return (
      <SovereignAuthGate 
        onAuthSuccess={(uid, role) => {
          setCurrentRole(role as any);
          setLifecycleState("handshake");
        }} 
      />
    );
  }

  if (lifecycleState === "handshake") {
    return (
      <NeuralHandshake 
        currentUser={currentUser}
        onAnalysisResult={(role, hasSubscription) => {
          setCurrentRole(role);
          if (role === "super-admin" || hasSubscription) {
            setLifecycleState("dashboard");
          } else {
            setLifecycleState("pricing");
          }
        }}
      />
    );
  }

  if (lifecycleState === "pricing") {
    return (
      <SovereignPricingPage 
        currentUser={currentUser}
        onPlanActivated={(plan) => {
          setCurrentPlan(plan);
          setLifecycleState("dashboard");
        }}
      />
    );
  }

  return (
    <div id="sovereign-root" className={`min-h-screen flex flex-col justify-between selection:bg-cyan-500/30 selection:text-white transition-colors duration-300 ${
      isLightMode 
        ? "bg-[#FAF9F5] text-stone-900" 
        : "bg-[#0c0523] text-purple-100"
    }`}>
      
      {/* Outer ambient radiant background glows */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-300 ${
        isLightMode 
          ? "bg-[radial-gradient(ellipse_at_top_right,rgba(15,76,129,0.04),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(28,25,23,0.03),transparent_50%)]" 
          : "bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.06),transparent_50%)]"
      }`} />

      {/* Container segment: Sidebar navbar + Content screen */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-transparent relative z-10">
        
        {/* Left Sidebar Menu Drawer (Medical Velvet Space Yacht Aesthetic) */}
        <aside id="sidebar-navigation" className={`w-full md:w-68 border-b md:border-b-0 md:border-r py-5 flex flex-col justify-between shrink-0 select-none backdrop-blur-md transition-all duration-300 ${
          isLightMode 
            ? "bg-[#F4F2EE] border-stone-200/90 text-stone-800" 
            : "bg-[#150a36]/90 border-purple-500/10 text-purple-100"
        }`}>
          <div>
            {/* Title / Launcher Logo */}
            <div className={`px-5 pb-5 border-b flex items-center justify-between ${isLightMode ? "border-stone-200" : "border-purple-950/50"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 border rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isLightMode 
                    ? "bg-white border-stone-300 text-[#0f4c81] shadow-sm" 
                    : "bg-purple-900/40 border border-[#22d3ee]/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] text-cyan-400"
                }`}>
                  <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h1 className={`text-[13px] font-black tracking-widest uppercase italic leading-none ${isLightMode ? "text-stone-900" : "text-white"}`}>SANTÉ CORE</h1>
                  <span className={`text-[8.5px] block font-mono font-bold tracking-wider uppercase ${isLightMode ? "text-stone-400" : "text-[#7c6bb5]"}`}>CLINICAL OPERATING OS</span>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className={`p-1.5 md:hidden rounded-lg border transition-all ${
                  isLightMode 
                    ? "hover:bg-stone-200 text-stone-600 hover:text-stone-900 border-stone-200" 
                    : "hover:bg-purple-950 text-purple-300 hover:text-white border-purple-800/10"
                }`}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

            {/* Nav List */}
            <nav className={`px-3 pt-4 space-y-1.5 ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
              {navigationTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider text-left transition-all relative cursor-pointer ${
                      isActive 
                        ? isLightMode
                          ? "bg-white text-[#0f4c81] border border-stone-300/80 shadow-[0_3px_10px_rgba(0,0,0,0.02)] font-black"
                          : "bg-[#24175e] text-cyan-400 border border-cyan-400/25 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-extrabold" 
                        : isLightMode
                          ? "text-stone-500 hover:bg-stone-200/50 hover:text-stone-900 border border-transparent"
                          : "text-[#7c6bb5] hover:bg-purple-950/40 hover:text-white border border-transparent"
                    }`}
                  >
                    <TabIcon className={`w-4 h-4 shrink-0 ${
                      isActive 
                        ? isLightMode 
                          ? "text-[#0f4c81]" 
                          : "text-cyan-400 drop-shadow-[0_0_3px_#22d3ee]" 
                        : isLightMode 
                          ? "text-stone-400" 
                          : "text-[#7c6bb5]"
                    }`} />
                    <span>{tab.label}</span>
                    {isActive && (
                      <div className={`absolute right-3.5 top-4.5 w-1.5 h-1.5 rounded-full ${
                        isLightMode ? "bg-[#0f4c81]" : "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                      }`} />
                    )}
                  </button>
                );
              })}

              {/* Global Sign Out Button */}
              <button
                id="global-logout-btn"
                onClick={() => setShowLogoutConfirm(true)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider text-left transition-all mt-4 cursor-pointer border ${
                  isLightMode 
                    ? "text-[#dc2626] hover:bg-red-50/60 border-red-200 hover:border-red-400" 
                    : "text-[#f43f5e] hover:bg-rose-950/20 border-rose-950/40 hover:border-rose-850"
                }`}
              >
                <LogOut className="w-4 h-4 shrink-0 text-[#f43f5e]" />
                <span>{t("common.logout")}</span>
              </button>
            </nav>
          </div>

          {/* Quick Stats system cards on lower Sidebar boundary */}
          <div className={`px-4 pt-4 border-t hidden md:block space-y-3.5 ${isLightMode ? "border-stone-200" : "border-purple-950/50"}`}>
            <div className={`p-4 rounded-2xl border text-[10px] font-mono leading-relaxed space-y-1.5 transition-all duration-300 ${
              isLightMode 
                ? "bg-white border-stone-200 text-stone-600" 
                : "bg-[#1a0e41]/60 border-purple-500/10 text-purple-200"
            }`}>
              <span className={`font-bold block uppercase tracking-wider ${isLightMode ? "text-stone-400" : "text-[#7c6bb5]"}`}>HOSPITAL INTEGRATION</span>
              <div className="flex justify-between">
                <span>Enforcement Deck:</span>
                <span className={`font-extrabold ${isLightMode ? "text-[#0f4c81]" : "text-cyan-400"}`}>Active (HR-V2)</span>
              </div>
              <div className="flex justify-between">
                <span>Secure Tunneling:</span>
                <span className={`font-extrabold ${isLightMode ? "text-emerald-600" : "text-teal-400"}`}>Encrypted Port</span>
              </div>
            </div>
            <div className={`text-center font-mono text-[8px] font-bold tracking-widest uppercase ${
              isLightMode ? "text-stone-400" : "text-purple-500"
            }`}>
              UNIVERSITE DE RABAT V2
            </div>
          </div>
        </aside>

        {/* Main Content Workspace viewport */}
        <main id="main-telemetry-canvas" className="flex-1 flex overflow-hidden bg-transparent">
          <div className="flex-1 overflow-y-auto p-5 md:p-8 pb-12">
            
            {/* Header Telemetry Ticker of active tab */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b gap-3 transition-colors duration-300 ${
              isLightMode ? "border-stone-200" : "border-purple-950/40"
            }`}>
              <div>
                <span className={`font-mono text-[9px] font-bold tracking-widest uppercase block mb-1 ${
                  isLightMode ? "text-stone-400" : "text-[#7c6bb5]"
                }`}>SOVEREIGN HEALTH & SECURITY INTERACTION</span>
                <h2 className={`text-lg font-black tracking-widest uppercase italic leading-none transition-colors duration-350 ${
                  isLightMode ? "text-stone-900" : "text-white"
                }`}>
                  {navigationTabs.find(t => t.id === activeTab)?.label}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[9px]">
                {/* Global Theme Preset Toggles inside the telemetry dashboard perimeter */}
                <button
                  onClick={() => setIsLightMode(!isLightMode)}
                  className={`px-3 py-1.5 border rounded-xl font-mono text-[9px] uppercase tracking-widest font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isLightMode 
                      ? "bg-white border-stone-200 text-stone-700 hover:bg-stone-50 shadow-sm" 
                      : "bg-[#1a0e41]/80 border-purple-500/10 text-cyan-400 hover:bg-[#24175e]/70"
                  }`}
                  title="Toggle Global Presentation Preset"
                >
                  {isLightMode ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>DARK THEME</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>LIGHT THEME</span>
                    </>
                  )}
                </button>

                {/* Global Language Selector (Internationalization System Engine) */}
                <button
                  onClick={() => setLang(lang === "en" ? "fr" : "en")}
                  className={`px-3 py-1.5 border rounded-xl font-mono text-[9px] uppercase tracking-widest font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isLightMode 
                      ? "bg-white border-stone-200 text-stone-750 hover:bg-stone-50 shadow-sm" 
                      : "bg-[#1a0e41]/80 border-purple-500/10 text-cyan-400 hover:bg-[#24175e]/70"
                  }`}
                  title="Toggle Global Language / Langue"
                >
                  <Globe className="w-3.5 h-3.5 text-[#22d3ee]" />
                  <span>{lang === "en" ? "FRANÇAIS (FR)" : "ENGLISH (EN)"}</span>
                </button>

                <div className={`flex items-center gap-2 border px-3.5 py-2 rounded-xl transition-all duration-300 ${
                  isLightMode 
                    ? "bg-white border-stone-200 text-stone-600" 
                    : "bg-[#1a0e41]/80 border-purple-500/10 text-purple-300"
                }`}>
                  <Bot className={`w-3.5 h-3.5 ${isLightMode ? "text-[#0f4c81]" : "text-cyan-400"}`} />
                  <span>MONITORING:</span>
                  <strong className={`uppercase font-black tracking-widest ${isLightMode ? "text-[#0f4c81]" : "text-cyan-400"}`}>NOMINAL</strong>
                </div>

                <div className={`flex items-center gap-1.5 border px-3.5 py-2 rounded-xl transition-all duration-300 ${
                  isLightMode 
                    ? "bg-[#0f4c81]/5 border-[#0f4c81]/15 text-[#0f4c81]" 
                    : "bg-cyan-950/45 border border-cyan-500/25 text-cyan-400"
                }`}>
                  <span>TIER:</span>
                  <strong className={`${isLightMode ? "text-stone-900" : "text-white"} uppercase font-black tracking-wider`}>{currentPlan}</strong>
                </div>

                <div className={`flex items-center gap-1.5 border px-3.5 py-2 rounded-xl transition-all duration-300 ${
                  isLightMode 
                    ? "bg-amber-500/5 border-amber-500/20 text-[#a0522d]" 
                    : "bg-[#120732] border border-purple-500/20 text-[#ff5c00]"
                }`}>
                  <span>ROLE:</span>
                  <strong className={`${isLightMode ? "text-stone-900" : "text-white"} uppercase font-black tracking-wider`}>{currentRole}</strong>
                </div>
              </div>
            </div>

            {/* Tab Swappers */}
            {activeTab === "dashboard" && (
              <CommandCenterPage 
                devices={devices} 
                logs={logs} 
                onSelectDevice={(dev) => setSelectedDeviceId(dev ? dev.id : null)} 
                onClearAlert={handleClearAlert}
                onNavigateToTab={(tabId) => setActiveTab(tabId)}
                isLightMode={isLightMode}
                onToggleLightMode={() => setIsLightMode(!isLightMode)}
              />
            )}

            {activeTab === "health-matrix" && (
              <HealthMatrix 
                devices={devices}
                onSelectDevice={(dev) => setSelectedDeviceId(dev ? dev.id : null)}
                onModifyDeviceStatus={handleModifyDeviceStatus}
              />
            )}

            {activeTab === "data-flow" && (
              <DataVisualizationFlow />
            )}

            {activeTab === "quantum-node" && (
              <QuantumNode devices={devices} />
            )}

            {activeTab === "insights" && (
              <VisionArchitecte devices={devices} logs={logs} isLightMode={isLightMode} />
            )}

            {activeTab === "perimeter" && (
              <SecurityPerimeter />
            )}

            {activeTab === "terminal" && (
              <RemoteTerminal 
                devices={devices}
                onAddLog={handleAddLog}
              />
            )}

            {activeTab === "timeline" && (
              <IncidentTimeline 
                logs={logs}
                devices={devices}
                onSelectDevice={(dev) => setSelectedDeviceId(dev ? dev.id : null)}
              />
            )}

            {activeTab === "global-map" && (
              <GlobalHorizonMap devices={devices} />
            )}

            {activeTab === "settings" && (
              <SettingsPage 
                initialSettings={sovereignSettings} 
                onApplySettings={handleApplySovereignSettings} 
              />
            )}

            {activeTab === "client-dashboard" && (
              <ClientDashboard 
                devices={devices} 
                logs={logs} 
                onAddLog={handleAddLog} 
                isLightMode={isLightMode} 
                onModifyDeviceStatus={handleModifyDeviceStatus}
                onActionTriggered={handleActionTriggered}
              />
            )}

            {activeTab === "gmail" && (
              <SovereignGmail 
                initialCompose={gmailInitialCompose}
                onClearInitialCompose={() => setGmailInitialCompose(null)}
              />
            )}

            {activeTab === "platform-gate" && (
              <PlatformHypervisor 
                currentRole={currentRole}
                onChangeRole={handleUpdateRole}
                currentPlan={currentPlan}
                onChangePlan={handleUpdatePlan}
                onAddLog={handleAddLog}
              />
            )}

            {activeTab === "sovereign-audit" && (
              <SovereignAudit 
                currentRole={currentRole}
                onChangeRole={handleUpdateRole}
                devices={devices}
                policies={policies}
              />
            )}

            {activeTab === "observation-deck" && (
              <ObservationDeck 
                devices={devices} 
                currentRole={currentRole}
              />
            )}

            {activeTab === "appliance-core" && (
              <ApplianceCore 
                currentRole={currentRole}
                devices={devices}
              />
            )}

            {activeTab === "asset-enrollment" && (
              <AssetEnrollment 
                currentRole={currentRole}
                devices={devices}
                onAddLog={handleAddLog}
              />
            )}

            {activeTab === "contacts" && (
              <SovereignContacts 
                currentRole={currentRole}
                onChangeRole={handleUpdateRole}
                isLightMode={isLightMode}
              />
            )}

            {activeTab === "devices" && (
              <DevicesView 
                devices={devices} 
                selectedDevice={selectedDevice} 
                onSelectDevice={(dev) => setSelectedDeviceId(dev ? dev.id : null)} 
              />
            )}

            {activeTab === "policies" && (
              <PoliciesView 
                policies={policies} 
                onTogglePolicy={handleTogglePolicy} 
                onDeployPolicies={handleDeployPoliciesAll} 
              />
            )}

            {activeTab === "software" && (
              <SoftwareView 
                softwarePackages={software} 
                onTriggerUpdate={handleTriggerSoftwareUpdate} 
              />
            )}

            {activeTab === "dns" && (
              <DNSView 
                devices={devices}
                dnsRecords={dnsRecords}
                dnsQueryLogs={dnsQueryLogs}
                onAddRecord={handleAddDNSRecord}
                onToggleRecord={handleToggleDNSRecord}
                onDeleteRecord={handlePurgeDNSRecord}
                onTriggerTestQuery={handleTriggerDiagnosticsDNSQuery}
              />
            )}

          </div>

          {/* Right Deep Dive focuses Sidebar (slides in smoothly when device clicked) */}
          {selectedDevice && (
            <RightFocusPanel 
              device={selectedDevice} 
              onClose={() => setSelectedDeviceId(null)} 
              onActionTriggered={handleActionTriggered} 
            />
          )}

        </main>
      </div>

      {/* System Telemetry Lower Deck status bar */}
      <SystemStatusBar logs={logs} isConnected={true} isLightMode={isLightMode} />

      {/* Dynamic Security Verification LogOut Confirmation Modal */}
      {showLogoutConfirm && (
        <div id="logout-confirm-overlay" className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
          <div className={`w-full max-w-sm rounded-3xl border p-6 text-center space-y-5 shadow-2xl transition-all duration-300 ${
            isLightMode 
              ? "bg-[#FAF9F5] border-stone-200 text-stone-900" 
              : "bg-[#0c0523] border-[#ff5a00]/30 text-white"
          }`}>
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border transition-all duration-300 ${
              isLightMode 
                ? "bg-stone-100 border-stone-300 text-stone-700" 
                : "bg-[#ff5a00]/10 border-[#ff5a00]/25 text-[#ff5a00]"
            }`}>
              <LogOut className={`w-6 h-6 ${!isLightMode ? "animate-pulse" : ""}`} />
            </div>

            <div className="space-y-1.5 text-center">
              <h3 className="text-base font-black uppercase tracking-wider font-sans">
                SECURITY VERIFICATION
              </h3>
              <p className={`text-xs ${isLightMode ? "text-stone-500" : "text-stone-400"}`}>
                End session and lock the security terminal?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                id="cancel-logout-btn"
                onClick={() => setShowLogoutConfirm(false)}
                className={`w-1/2 font-mono text-[9px] font-black uppercase tracking-widest py-3.5 rounded-xl transition-all border cursor-pointer ${
                  isLightMode 
                    ? "bg-white border-stone-200 text-stone-700 hover:bg-stone-50" 
                    : "bg-transparent border-neutral-800 text-stone-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {t("common.cancel")}
              </button>
              
              <button
                id="confirm-logout-btn"
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  await logout();
                  setLifecycleState("landing");
                }}
                className={`w-1/2 font-mono text-[9px] font-black uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer text-white ${
                  isLightMode
                    ? "bg-[#0f4c81] hover:bg-[#0c3c66]"
                    : "bg-[#ff5a00] hover:bg-[#ff7e00]"
                }`}
              >
                {t("common.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
