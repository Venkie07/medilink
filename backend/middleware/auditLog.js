import logger from '../utils/logger.js';

/**
 * Automated Audit Logging Middleware
 * Captures all mutating HTTP operations (POST, PUT, PATCH, DELETE)
 * and logs the actor, action, resource, and timestamp to the audit trail.
 */
export const auditLog = (req, res, next) => {
  const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (!mutatingMethods.includes(req.method)) {
    return next();
  }

  // Capture response finish to log after status code is determined
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const userId = req.user?.userId || req.user?.id || 'anonymous';
    const role = req.user?.role || 'unknown';

    const auditEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      actor: userId,
      role: role,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip,
    };

    // Log at different levels based on outcome
    if (res.statusCode >= 500) {
      logger.error(`AUDIT [SERVER_ERROR] ${JSON.stringify(auditEntry)}`);
    } else if (res.statusCode >= 400) {
      logger.warn(`AUDIT [CLIENT_ERROR] ${JSON.stringify(auditEntry)}`);
    } else {
      logger.info(`AUDIT [OK] ${JSON.stringify(auditEntry)}`);
    }
  });

  next();
};
