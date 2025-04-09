module.exports = function enhanceResponse(res) {
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };

  res.send = function (data) {
    res.end(typeof data === 'string' ? data : String(data));
  };

  res.json = function (data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  return res;
};