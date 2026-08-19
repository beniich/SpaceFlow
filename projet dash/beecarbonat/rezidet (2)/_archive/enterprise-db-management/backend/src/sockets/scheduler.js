// sockets/scheduler.js
import { Server } from "socket.io";

export function initSchedulerSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: { origin: "*" },
        path: "/ws/scheduler",
    });

    const personnel = [
        "Alex Henderson", "Sarah Jenkins", "Marcus Vane", "Dave Miller", "Elena Rodriguez"
    ];

    const statuses = ["online", "break", "offline", "busy"];

    function getRandomStatusUpdate() {
        const person = personnel[Math.floor(Math.random() * personnel.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        return {
            type: "PERSONNEL_UPDATE",
            data: { name: person, status }
        };
    }

    function getRandomOrder() {
        const id = Math.floor(1000 + Math.random() * 9000);
        return {
            type: "NEW_ORDER",
            data: {
                id: `#WO-${id}`,
                title: "Emergency Repair",
                priority: "Urgent",
                time: new Date().toISOString()
            }
        };
    }

    io.on("connection", (socket) => {
        console.log("🔌 client scheduler socket connected:", socket.id);

        // Send initial sync
        socket.emit("scheduler:sync", {
            lastUpdate: new Date().toISOString(),
            activePersonnel: 12,
            pendingOrders: 5
        });

        // Simulate live updates
        const statusInterval = setInterval(() => {
            const update = getRandomStatusUpdate();
            socket.emit("scheduler:update", update);
        }, 5000);

        const orderInterval = setInterval(() => {
            const order = getRandomOrder();
            socket.emit("scheduler:update", order);
        }, 15000);

        // Heartbeat / Sync check
        const syncInterval = setInterval(() => {
            socket.emit("scheduler:sync", {
                lastUpdate: new Date().toISOString(),
                activePersonnel: 10 + Math.floor(Math.random() * 5),
                pendingOrders: 3 + Math.floor(Math.random() * 5)
            });
        }, 30000);

        socket.on("disconnect", () => {
            clearInterval(statusInterval);
            clearInterval(orderInterval);
            clearInterval(syncInterval);
            console.log("🔌 client scheduler socket disconnected:", socket.id);
        });
    });
}
