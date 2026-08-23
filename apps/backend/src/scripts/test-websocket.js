const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

// Générer token démo
const token = jwt.sign(
  { 
    sub: "demo-user",
    orgId: "demo-tenant-uuid",
    role: "DEMO"
  },
  process.env.JWT_SECRET || "test-secret-32-chars-minimum-required-yes",
  { expiresIn: "1h" }
);

const wsUrl = `ws://localhost:8081/ws/bim/model-building-office-tower-a/alerts?token=${token}`; // Assuming backend is on 8081

console.log(`🔌 Connexion: ${wsUrl}`);

const ws = new WebSocket(wsUrl);

ws.on("open", () => {
  console.log("✅ Connecté");
  
  // Test ping/pong
  setTimeout(() => {
    ws.send(JSON.stringify({ type: "ping" }));
  }, 1000);
  
  // Test abonnements
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: "request_history",
      since: new Date(Date.now() - 3600 * 1000).toISOString(),
      limit: 5,
    }));
  }, 2000);
});

ws.on("message", (data) => {
  const message = JSON.parse(data.toString());
  console.log("📨 Message reçu:", JSON.stringify(message, null, 2));
});

ws.on("close", (code, reason) => {
  console.log(`🔌 Déconnecté: ${code} - ${reason}`);
});

ws.on("error", (err) => {
  console.error("❌ Erreur:", err.message);
  process.exit(1);
});

// Auto-fermeture après 10s
setTimeout(() => {
  console.log("\n⏱️ Fin du test (10s)");
  ws.close();
  process.exit(0);
}, 10000);
