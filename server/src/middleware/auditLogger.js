const AuditLog = require('../models/AuditLog');

function audit(action, resource, getResourceId) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      if (res.statusCode < 400) {
        const resourceId = getResourceId ? getResourceId(req, res) : req.params.id;
        AuditLog.create({
          action,
          resource,
          resourceId: resourceId || undefined,
          user: req.user?._id,
          details: { method: req.method, path: req.originalUrl },
          ip: req.ip,
          userAgent: req.get('user-agent'),
        }).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  };
}

module.exports = audit;
