// generator.js – met à jour en place les métriques “live”
import { clusters } from "./fixtures.js";

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Retourne un objet contenant les métriques agrégées.
 * Les valeurs changent légèrement à chaque appel, ce qui simule du réel.
 */
export function generateMetrics() {
    // Lag moyen (ms) = sum(lag) * 1000 + jitter
    const avgLagMs = clusters
        .filter((c) => c.role === "replica")
        .reduce((sum, c) => sum + c.lag * 1000, 0);

    const jitter = randInt(-20, 30); // ± ms pour le “live”

    return {
        replicationLagMs: Math.max(0, Math.round(avgLagMs + jitter)),
        diskUsagePct: randInt(55, 85),
        ioThroughputIOPS: randInt(900, 1500),
        lastBackup: (() => {
            const success = Math.random() > 0.2;
            return success
                ? `${randInt(1, 30)} min ago`
                : "failed – see logs";
        })(),
        activeNodes: randInt(10, 15),
    };
}
