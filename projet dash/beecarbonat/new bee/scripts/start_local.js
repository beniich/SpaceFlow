const { spawn } = require('child_process');
const path = require('path');

const services = [
    { name: 'Gateway', dir: 'microservices/api-gateway', cmd: 'npm', args: ['run', 'dev'], env: { PORT: 5001 } },
    { name: 'Backend', dir: 'backend', cmd: 'npm', args: ['run', 'dev'], env: { PORT: 5009, DISABLE_KAFKA: 'true' } },
    { name: 'Auth', dir: 'microservices/auth-service', cmd: 'npm', args: ['run', 'dev'], env: { PORT: 3001, DISABLE_KAFKA: 'true' } },
    { name: 'Complaints', dir: 'microservices/complaints-service', cmd: 'npm', args: ['run', 'dev'], env: { PORT: 3002, DISABLE_KAFKA: 'true' } },
    { name: 'Teams', dir: 'microservices/teams-service', cmd: 'npm', args: ['run', 'dev'], env: { PORT: 3003, DISABLE_KAFKA: 'true' } },
    { name: 'Notification', dir: 'microservices/notification-service', cmd: 'npm', args: ['run', 'dev'], env: { PORT: 3004, DISABLE_KAFKA: 'true' } },
    { name: 'Analytics', dir: 'microservices/analytics-service', cmd: 'npm', args: ['run', 'dev'], env: { PORT: 3005, DISABLE_KAFKA: 'true' } },
    { name: 'Inventory', dir: 'microservices/inventory-service', cmd: 'npm', args: ['run', 'dev'], env: { PORT: 3006, DISABLE_KAFKA: 'true' } },
    { name: 'Frontend', dir: 'frontend', cmd: 'npm', args: ['run', 'dev'], env: { PORT: 3000 } }
];

const processes = [];

console.log('🚀 Starting ReclamTrack Local Stack (No Docker)...');

services.forEach(service => {
    const servicePath = path.join(__dirname, '..', service.dir);
    const env = { ...process.env, ...service.env };

    console.log(`▶ Starting ${service.name}...`);

    const child = spawn('cmd.exe', ['/c', service.cmd, ...service.args], {
        cwd: servicePath,
        env: env,
        stdio: 'pipe',
        shell: true
    });

    child.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) console.log(`[${service.name}] ${line.trim()}`);
        });
    });

    child.stderr.on('data', (data) => {
        console.error(`[${service.name} ERR] ${data.toString().trim()}`);
    });

    processes.push(child);
});

// Handle exit
process.on('SIGINT', () => {
    console.log('🛑 Stopping all services...');
    processes.forEach(p => p.kill());
    process.exit();
});
