module.exports = async (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      req.body = JSON.parse(body);
    } catch {
      req.body = {};
    }
    next();
  });
};