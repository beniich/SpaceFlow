import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

export const applyCleanPipeCompression = compression();

// 1. In-memory behavior tracking
const behaviorStore = new Map<string, { requests: number, anomalies: number, lastReqTime: number }>();

// 2. Behavioral Anti-Bot Agent Middleware
export const cleanPipeAgent = (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    
    let record = behaviorStore.get(ip);
    if (!record) {
        record = { requests: 0, anomalies: 0, lastReqTime: now };
    }
    
    record.requests++;
    
    // Anomaly 1: Missing or generic/script User-Agent
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    if (!userAgent || userAgent.includes('curl') || userAgent.includes('wget') || userAgent.includes('python-requests')) {
        record.anomalies++;
    }

    // Anomaly 2: Mechanically fast requests (under 10ms gap)
    if (now - record.lastReqTime < 10) {
        record.anomalies++;
    }
    
    record.lastReqTime = now;
    behaviorStore.set(ip, record);

    // BLOCKING ACTION: Prevent request if anomalies exceed threshold
    if (record.anomalies >= 10) {
        console.warn(`🛑 [Clean-Pipe] Blocked IP: ${ip} for behavioral anomalies (Score: ${record.anomalies}).`);
        return res.status(403).json({
            error: "Forbidden",
            message: "Action rejected by our behavioral security system."
        });
    }

    // Observability hook: Track 4xx responses (Scanning attempts)
    const originalSend = res.send;
    res.send = function (body) {
        if (res.statusCode >= 400 && res.statusCode < 500) {
            const updated = behaviorStore.get(ip);
            if (updated) {
                updated.anomalies++;
                behaviorStore.set(ip, updated);
            }
        }
        return originalSend.call(this, body);
    };

    next();
};

// 3. Dynamic Rate Limiting (Guard against DDOS)
export const cleanPipeRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1000, // Safe limit for standard users
    message: { error: "Too many requests to the server. Please wait." }
});

export const applyCleanPipe = [
    applyCleanPipeCompression,
    cleanPipeAgent,
    cleanPipeRateLimiter
];
