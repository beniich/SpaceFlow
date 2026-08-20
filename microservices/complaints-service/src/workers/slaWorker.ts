/**
 * SLA Worker — runs on an interval, finds breached complaints,
 * emits a Kafka event, marks them as notified (once only).
 */
import { Complaint } from '../models/Complaint';
import { producer } from '../index';

const INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes

async function checkSLABreaches(): Promise<void> {
    try {
        const now = new Date();

        // Find complaints that:
        //  - are past their SLA due date
        //  - are NOT yet resolved/closed/rejected
        //  - have NOT been notified yet
        const breached = await Complaint.find({
            slaDueDate: { $lt: now },
            status:     { $nin: ['résolue', 'fermée', 'rejetée'] },
            slaNotified: { $ne: true },
        }).select('_id number category priority email assignedTeamId slaDueDate createdAt');

        if (breached.length === 0) return;

        console.log(`[SLA Worker] ${breached.length} breach(es) detected at ${now.toISOString()}`);

        for (const complaint of breached) {
            try {
                // Emit Kafka event
                await producer.send({
                    topic: 'complaint-events',
                    messages: [{
                        value: JSON.stringify({
                            type: 'COMPLAINT_SLA_BREACH',
                            complaintId:  complaint._id,
                            number:       complaint.number,
                            category:     complaint.category,
                            priority:     complaint.priority,
                            email:        complaint.email,
                            slaDueDate:   complaint.slaDueDate,
                            overdueByMs:  now.getTime() - new Date(complaint.slaDueDate!).getTime(),
                            timestamp:    now,
                        }),
                    }],
                });

                // Add timeline event
                complaint.slaNotified = true;
                (complaint as any).timeline?.push({
                    eventType: 'status_changed',
                    message:   `⚠️ Délai SLA dépassé — ticket toujours ouvert après l'échéance du ${new Date(complaint.slaDueDate!).toLocaleDateString('fr-FR')}.`,
                    actorName: 'Système (SLA Worker)',
                    createdAt: now,
                });

                await complaint.save();
                console.log(`[SLA Worker] Breach notified for ${complaint.number}`);
            } catch (err) {
                console.error(`[SLA Worker] Failed for ${complaint.number}:`, err);
            }
        }
    } catch (err) {
        console.error('[SLA Worker] Query error:', err);
    }
}

export function startSLAWorker(): void {
    console.log(`[SLA Worker] Started — checking every ${INTERVAL_MS / 60_000} minutes`);

    // Run immediately on startup, then on interval
    setTimeout(checkSLABreaches, 10_000); // wait 10s after boot
    setInterval(checkSLABreaches, INTERVAL_MS);
}
