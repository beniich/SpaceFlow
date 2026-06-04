# Sovereign Nexus - Firestore Security Specification

This document details the Zero-Trust security rules and state invariants governing the Sovereign Nexus database engine.

## 1. Core Data Invariants

1. **Hierarchy Integrity**: No device, security policy, system log, or group folder can exist outside a validated `/users/{userId}` parent node. Removing or blocking the parent account synchronously invalidates access to all sub-resources.
2. **Clearance Level Lock (RBAC)**: Users can only operate within the boundaries of their assigned `role`. Writing records targeting modules restricted by the active role triggers instantaneous validation rejection.
3. **SaaS Plan Lock (Billing)**: Action frequencies (e.g. overclock limits, ping metric intervals) and resource counts are strictly bounded based on the subscription `plan`.
4. **Time Invariant**: All timestamps (e.g. `createdAt`, `updatedAt`) must enforce temporal synchronization using `request.time`. Client-supplied offsets are rejected.
5. **PII Hermetic Seal**: User email addresses must be strictly isolated to the user's root profile and readable only by the owner itself.

---

## 2. The "Dirty Dozen" Rogue Payloads (Intentional Vulnerability Targets)

Below are twelve malicious payloads designed to crash or bypass standard rules. Our ruleset guarantees all these operations result in `PERMISSION_DENIED`:

### Hack 01: Privilege Escalation (Self-Assigned Role)
* **Goal**: Attempt to register as `super-admin` on another user or self.
* **Payload**: `setDoc(doc(db, "users/ATTACKER_UID"), { email: "attacker@gmail.com", role: "super-admin", plan: "imperial" })` without administrative signatures.

### Hack 02: Impersonate Record Creation (Cross-User Write)
* **Goal**: Write a rogue device log into User B's subcollection.
* **Payload**: `setDoc(doc(db, "users/USER_B/systemLogs/ROUGELOG"), { id: "ROUGELOG", ownerId: "ATTACKER_UID", message: "Malicious command injected", timestamp: "12:00:00", source: "Rogue-Terminal", level: "critical" })` while authenticated as User A.

### Hack 03: Orphaned Key Injection (Ghost Field Vulnerability)
* **Goal**: Inject a hidden verification status bypass field when adding a device.
* **Payload**: `setDoc(doc(db, "users/USER_A/devices/DEV-01"), { ...validDeviceData, isRootBypassValidated: true })`.

### Hack 04: Boundary Overflow (Denial-of-Wallet Path Exhaustion)
* **Goal**: Inject string path variables consisting of 2MB long junk data to exhaust storage/indexing quotas.
* **Payload**: `getDoc(doc(db, "users/USER_A/devices/" + "A".repeat(50000)))`.

### Hack 05: Status Shortcutting (Terminal State Lock Bypass)
* **Goal**: Force update an offline critical device warning parameter to warning/online without performing healing adapters.
* **Payload**: `updateDoc(doc(db, "users/USER_A/devices/DEV-043"), { status: "online", cpu: 0 })`.

### Hack 06: Zero-Entropy/Spoofed Clock Invariant Attack
* **Goal**: Force setting creation dates to historical times or future times.
* **Payload**: `setDoc(doc(db, "users/USER_A/systemLogs/LOG-100"), { ..., timestamp: "00:00:00", createdAt: Timestamp.fromDate(new Date("1970-01-01")) })`.

### Hack 07: Unchecked Empty Domain Records
* **Goal**: Inject a security policy listing an empty string name with maximum severity to lock system logs.
* **Payload**: `setDoc(doc(db, "users/USER_A/securityPolicies/POL-001"), { name: "", severity: "critical", category: "Network", enabled: true, lastEnforced: "now" })`.

### Hack 08: Missing Relational Reference Binding (Dead Link Record)
* **Goal**: Generate a system log associated with a non-existent device node.
* **Payload**: `setDoc(doc(db, "users/USER_A/systemLogs/LOG-999"), { ..., deviceId: "NON_EXISTING_DEVICE" })`.

### Hack 09: PII Blanket Harvest (Query Scraping)
* **Goal**: List all active SaaS profiles with email details using generic reads.
* **Query**: `db.collection("users").get()` as general signed-in user.

### Hack 10: Array Poisoning & Overflow
* **Goal**: Override an authorized operator list with 500 malicious items.
* **Payload**: `updateDoc(doc(db, "users/USER_A"), { admins: ["att-1", "att-2", ..., "att-500"] })`.

### Hack 11: Non-Email-Verified Authorization Bypass
* **Goal**: Write data using a completely fresh Google Account without email verification.
* **Payload**: Authenticated with `request.auth.token.email_verified == false` attempt to modify compliance policies.

### Hack 12: Sub-resource Action Mutation hijacking
* **Goal**: Write policies that skip validation checks using partial updates.
* **Payload**: `updateDoc(doc(db, "users/USER_A/securityPolicies/POL-003"), { enabled: true, isBypass: true })`.

---

## 3. Test Runner Structure (`firestore.rules.test.ts`)

```typescript
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

describe("Sovereign Nexus Security Fortress", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "gen-lang-client-0064917152",
      firestore: {
        host: "localhost",
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it("should fail on Hack 01: Self-assigning super-admin status", async () => {
    const context = testEnv.authenticatedContext("attacker_id", { email_verified: true });
    const db = context.firestore();
    await assertFails(
      setDoc(doc(db, "users/attacker_id"), {
        uid: "attacker_id",
        email: "attacker@gmail.com",
        role: "super-admin",
        plan: "imperial"
      })
    );
  });

  it("should fail on Hack 02: Injecting foreign command logs", async () => {
    const context = testEnv.authenticatedContext("user_a", { email_verified: true });
    const db = context.firestore();
    await assertFails(
      setDoc(doc(db, "users/user_b/systemLogs/log_abc"), {
        id: "log_abc",
        ownerId: "user_a",
        message: "Malicious bypass",
        timestamp: "12:00:00",
        source: "Hack",
        level: "critical"
      })
    );
  });
});
```
