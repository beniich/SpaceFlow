// fixtures.js – données factices – à ne pas toucher sauf si vous voulez personnaliser
export const clusters = [
    {
        id: "master",
        name: "PostgreSQL Master",
        role: "master",
        status: "healthy",
        version: "13.4‑1",
        uptime: "12d 23h",
        cpu: 38,
        ram: { used: 16, total: 32 },
        iops: 1200,
        connections: 112,
    },
    {
        id: "replica-1",
        name: "Replica #1",
        role: "replica",
        status: "sync",
        lag: 0.04,
        version: "13.4‑1",
        cpu: 22,
        ram: { used: 12, total: 32 },
        iops: 950,
        connections: 78,
    },
    {
        id: "replica-2",
        name: "Replica #2",
        role: "replica",
        status: "lagging",
        lag: 0.07,
        version: "13.4‑1",
        cpu: 30,
        ram: { used: 15, total: 32 },
        iops: 1050,
        connections: 102,
    },
];

export const backups = [
    {
        id: "2024‑02‑11‑01",
        timestamp: "2024‑02‑11T09:00:00Z",
        sizeGB: 120,
        durationSec: 120,
        status: "success",
    },
    {
        id: "2024‑02‑10‑01",
        timestamp: "2024‑02‑10T09:00:00Z",
        sizeGB: 118,
        durationSec: 115,
        status: "failed",
        error: "network timeout",
    },
    {
        id: "2024‑02‑09‑01",
        timestamp: "2024‑02‑09T09:00:00Z",
        sizeGB: 115,
        durationSec: 108,
        status: "success",
    },
];
