const http = require('http');
const url = require('url');

class MyFramework {
  constructor() {
    this.middlewares = [];
    this.routes = {};
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  registerRoute(method, path, handler) {
    const key = `${method.toUpperCase()} ${path}`;
    this.routes[key] = handler;
  }

  get(path, handler) {
    this.registerRoute('GET', path, handler);
  }

  post(path, handler) {
    this.registerRoute('POST', path, handler);
  }

  put(path, handler) {
    this.registerRoute('PUT', path, handler);
  }

  patch(path, handler) {
    this.registerRoute('PATCH', path, handler);
  }

  delete(path, handler) {
    this.registerRoute('DELETE', path, handler);
  }

  async handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    req.query = parsedUrl.query;
    req.pathname = parsedUrl.pathname;

    let i = 0;
    const next = () => {
      const middleware = this.middlewares[i++];
      if (middleware) {
        middleware(req, res, next);
      } else {
        this.handleRoute(req, res);
      }
    };

    try {
      next();
    } catch (err) {
      console.error('Ошибка при обработке запроса:', err);
      res.statusCode = 500;
      res.end('Внутренняя ошибка сервера');
    }
  }

  handleRoute(req, res) {
    const key = `${req.method} ${req.pathname}`;
    const handler = this.routes[key];

    res.send = (data) => {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(data);
    };

    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };

    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    if (handler) {
      try {
        handler(req, res);
      } catch (err) {
        console.error('Ошибка в обработчике маршрута:', err);
        res.statusCode = 500;
        res.end('Ошибка маршрута');
      }
    } else {
      res.statusCode = 404;
      res.end('Маршрут не найден');
    }
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => this.handleRequest(req, res));
    server.listen(port, callback);
  }
}

module.exports = MyFramework;