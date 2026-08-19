const { spawn } = require('child_process');
const path = require('path');

const services = [
    {
        name: 'Backend',
        dir: 'backend',
        cmd: 'npm',
        args: ['run', 'dev'],
        env: {
            PORT: 5001,
            DISABLE_KAFKA: 'true',
            MONGO_URI: 'mongodb://127.0.0.1:27017/reclamtrack',
            JWT_SECRET: 'supersecretkey', // Fallback
            NODE_ENV: 'development'
        }
    },
    {
        name: 'Frontend',
        dir: 'frontend',
        cmd: 'npm',
        args: ['run', 'dev'],
        env: {
            PORT: 3000,
            NEXT_PUBLIC_API_URL: 'http://localhost:5001/api'
        }
    }
];

const processes = [];

console.log('🚀 Starting ReclamTrack SIMPLE Stack (Backend + Frontend)...');
console.log('ℹ️  Microservices & Kafka are DISABLED.');

// Build Shared Package First
console.log('📦 Building @reclamtrack/shared...');
try {
    const sharedPath = path.join(__dirname, '..', 'shared');
    require('child_process').execSync('npm run build', { cwd: sharedPath, stdio: 'inherit' });
    console.log('✅ Shared package built successfully.');
} catch (error) {
    console.error('❌ Failed to build shared package:', error.message);
    process.exit(1);
}

services.forEach(service => {
    const servicePath = path.join(__dirname, '..', service.dir);
    // Merge process.env with service.env (service.env wins)
    const env = { ...process.env, ...service.env };

    console.log(`▶ Starting ${service.name}...`);

    const child = spawn('cmd.exe', ['/c', service.cmd, ...service.args], {
        cwd: servicePath,
        env: env, // Explicitly pass the modified env
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
        // Some tools output to stderr even for info/warnings (like ts-node-dev)
        const msg = data.toString().trim();
        if (msg) console.error(`[${service.name} LOG] ${msg}`);
    });

    processes.push(child);
});

// Handle exit
process.on('SIGINT', () => {
    console.log('🛑 Stopping all services...');
    processes.forEach(p => p.kill());
    process.exit();
});
