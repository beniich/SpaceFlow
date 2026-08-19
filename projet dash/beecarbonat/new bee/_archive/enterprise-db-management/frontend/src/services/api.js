// src/services/api.js
import axios from "axios";
import { io } from "socket.io-client";

const api = axios.create({
    baseURL: "/api", // proxy configuré dans vite.config.js
});

/**
 * Métriques agrégées (lag, disque, IOPS, dernier backup…)
 */
export const fetchMetrics = () => api.get("/metrics");

/**
 * Liste des réplications (replicas)
 */
export const fetchReplicas = () => api.get("/replicas");

/**
 * Liste des backups
 */
export const fetchBackups = () => api.get("/backups");

/**
 * Liste des clusters (master + replicas)
 */
export const fetchClusters = () => api.get("/clusters");

/**
 * Initialise le socket qui renvoie les logs du terminal.
 * Retourne l’instance socket.io‑client.
 */
export const initLogSocket = () => {
    return io({
        path: "/ws/logs",
        transports: ["websocket"],
    });
};

/**
 * Initialise le socket pour le Scheduler RosterFlow.
 */
export const initSchedulerSocket = () => {
    return io({
        path: "/ws/scheduler",
        transports: ["websocket"],
    });
};
