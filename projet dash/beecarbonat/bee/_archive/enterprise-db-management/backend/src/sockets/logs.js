// sockets/logs.js
import { Server } from "socket.io";

/**
 * Simule un flux de logs toutes les 2 s.
 * Chaque message a une couleur (INFO / WARN / ERROR / BACKUP) que le client peut exploiter.
 */
export function initLogSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: { origin: "*" },
        path: "/ws/logs",
    });

    const logTypes = ["INFO", "WARN", "ERROR", "BACKUP"];
    const containers = [
        "SQL",
        "API_GATEWAY",
        "WORKER",
        "WAF",
        "AUTH",
        "REPLICA_1",
        "REPLICA_2",
    ];

    function randomLog() {
        const now = new Date().toISOString().replace("T", " ").split(".")[0];
        const type = logTypes[Math.floor(Math.random() * logTypes.length)];
        const container =
            containers[Math.floor(Math.random() * containers.length)];

        let message = "";
        switch (type) {
            case "INFO":
                message = "Heartbeat OK – all services healthy.";
                break;
            case "WARN":
                message = "Replication lag > 100 ms on replica‑2.";
                break;
            case "ERROR":
                message = "Duplicate key violation on table `complaints`.";
                break;
            case "BACKUP":
                message = "Backup #20240211‑01 completed (120 GB).";
                break;
        }

        return {
            timestamp: now,
            type,
            container,
            message,
        };
    }

    io.on("connection", (socket) => {
        console.log("🔌 client log socket connected:", socket.id);

        const interval = setInterval(() => {
            socket.emit("log", randomLog());
        }, 2000);

        socket.on("disconnect", () => {
            clearInterval(interval);
            console.log("🔌 client log socket disconnected:", socket.id);
        });
    });
}
