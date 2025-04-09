const url = require('url');

class Router {
  constructor() {
    this.routes = {};
  }

  addRoute(method, path, handler) {
    if (!this.routes[method]) this.routes[method] = {};
    this.routes[method][path] = handler;
  }

  handle(req, res) {
    const parsedUrl = url.parse(req.url, true);
    req.query = parsedUrl.query;
    const handler = this.routes[req.method]?.[parsedUrl.pathname];
    if (handler) {
      handler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Страница не найдена');
    }
  }
}

module.exports = Router;