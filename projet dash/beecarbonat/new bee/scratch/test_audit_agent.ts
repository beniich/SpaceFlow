import { connectDB } from '../backend/src/config/db.js';
import { InternalAuditAgent } from '../backend/src/services/auditAgent.service.js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function testAudit() {
    try {
        await connectDB();
        const result = await InternalAuditAgent.generateMonthlyAuditReport();
        console.log("Rapport généré avec succès !", result);
        process.exit(0);
    } catch (err) {
        console.error("Erreur lors de l'audit :", err);
        process.exit(1);
    }
}

testAudit();
