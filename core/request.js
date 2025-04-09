module.exports = function enhanceRequest(req, params, query, body) {
  req.params = params || {};
  req.query = query || {};
  req.body = body || null;
  return req;
};