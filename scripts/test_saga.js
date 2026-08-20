const axios = require('axios');

const GATEWAY_URL = 'http://localhost:5001';

// Test User Credentials (must exist in DB)
const USER_EMAIL = 'admin@reclamtrack.com'; // Adjust if needed
const USER_PASSWORD = 'password123'; // Adjust if needed

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runSagaTest() {
    console.log('🔄 Starting Saga Pattern E2E Verification...');

    try {
        // 1. Authenticate
        console.log('1️⃣ Authenticating...');
        let token;
        try {
            const authRes = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
                email: USER_EMAIL,
                password: USER_PASSWORD
            });
            token = authRes.data.token;
            console.log('✅ Authenticated.');
        } catch (e) {
            // Try registering if login fails
            console.log('⚠️ Login failed, trying registration...');
            const regRes = await axios.post(`${GATEWAY_URL}/api/auth/register`, {
                email: `test_${Date.now()}@example.com`,
                password: 'password123'
            });
            token = regRes.data.token;
            console.log('✅ Registered new test user.');
        }

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create Complaint
        console.log('2️⃣ Creating Complaint...');
        const complaintData = {
            title: `Saga Test Complaint ${Date.now()}`,
            description: 'Testing distributed assignment flow',
            category: 'Voirie',
            subcategory: 'Nid de poule',
            priority: 'medium',
            address: '123 Test St',
            city: 'Test City',
            district: 'Central',
            isAnonymous: false
        };

        const createRes = await axios.post(`${GATEWAY_URL}/api/complaints`, complaintData, { headers });
        const complaintId = createRes.data.data._id; // Adjust based on API response structure
        console.log(`✅ Complaint Created: ${complaintId}`);

        // 3. Poll for Saga Completion
        console.log('3️⃣ Polling for assignment (waiting 5s for Kafka)...');

        let attempts = 0;
        const maxAttempts = 10;
        let finalComplaint;

        while (attempts < maxAttempts) {
            await sleep(1000); // Wait 1s
            const pollRes = await axios.get(`${GATEWAY_URL}/api/complaints/${complaintId}`, { headers });
            const complaint = pollRes.data.data;

            console.log(`   Attempt ${attempts + 1}: Status=${complaint.status}, Team=${complaint.assignedTeamId}`);

            if (complaint.assignedTeamId || complaint.status === 'en cours' || complaint.priority === 'urgent') {
                finalComplaint = complaint;
                break;
            }
            attempts++;
        }

        // 4. Verification
        if (finalComplaint) {
            if (finalComplaint.assignedTeamId) {
                console.log(`🎉 SUCCESS: Saga completed! Team Assigned: ${finalComplaint.assignedTeamId}`);
            } else if (finalComplaint.priority === 'urgent') {
                console.log(`⚠️ SUCCESS (Compensation): Assignment failed, Priority Escalated to Urgent.`);
            } else {
                console.log(`❓ INCONCLUSIVE: State changed but unexpected.`);
            }
        } else {
            console.error(`❌ FAILED: Saga timed out. No assignment or compensation detected.`);
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error during test:', error.message);
        if (error.response) console.error('   Response:', error.response.data);
        process.exit(1);
    }
}

runSagaTest();
