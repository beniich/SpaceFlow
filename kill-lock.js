const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_7XBzjrWGCko0@ep-green-paper-avjxfi7j.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(async () => {
  const res = await client.query("SELECT pid FROM pg_locks WHERE locktype = 'advisory'");
  console.log('PIDs holding lock:', res.rows);
  for (let row of res.rows) {
      console.log(`Killing pid ${row.pid}`);
      await client.query(`SELECT pg_terminate_backend(${row.pid})`);
  }
  return client.end();
}).catch(e => { console.error(e.message); process.exit(1); });
