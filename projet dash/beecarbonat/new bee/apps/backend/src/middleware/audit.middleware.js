const { prisma } = require('../config/database');

const auditMiddleware = (entity) => {
  return async (req, res, next) => {
    // Intercept only modifying requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      // Create a function that intercepts res.send/res.json to extract the entityId if possible
      const originalSend = res.send;
      
      res.send = function (data) {
        res.send = originalSend;
        
        let entityId = null;
        let details = null;
        
        // Try to parse the response to find an ID or something
        try {
          if (typeof data === 'string') {
            const parsed = JSON.parse(data);
            entityId = parsed.id || req.params.id || null;
          } else if (typeof data === 'object') {
            entityId = data.id || req.params.id || null;
          }
        } catch (e) {
          entityId = req.params.id || null;
        }

        // Details could be the body sent
        try {
          details = JSON.stringify(req.body);
        } catch(e) {}

        const action = `${req.method}_${entity}`.toUpperCase();
        
        const userId = req.user?.id || req.crm?.userId || null;
        
        // Async log without awaiting to not block response
        prisma.auditLog.create({
          data: {
            userId,
            action,
            entity,
            entityId,
            ipAddress: req.ip || req.connection.remoteAddress,
            details
          }
        }).catch(err => console.error('AuditLog Error:', err));

        return res.send.apply(res, arguments);
      };
    }
    next();
  };
};

module.exports = { auditMiddleware };
