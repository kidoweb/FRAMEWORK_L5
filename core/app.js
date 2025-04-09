const http = require('http');
const EventEmitter = require('events');
const { errorHandler } = require('./errorHandler');

class App {
  constructor() {
    this.emitter = new EventEmitter();
    this.middlewares = [];
    this.routes = [];
  }

  use(middleware) {
    if (middleware instanceof Function) {
      this.middlewares.push(middleware);
    } else if (middleware.routes) {
      this.routes.push(...middleware.routes);
    }
  }

  listen(port, callback) {
    const server = http.createServer(async (req, res) => {
      try {
        req.query = Object.fromEntries(new URL(req.url, `http://${req.headers.host}`).searchParams.entries());
        req.body = '';
        req.on('data', chunk => {
          req.body += chunk;
        });
        req.on('end', async () => {
          if (req.body) {
            try {
              req.body = JSON.parse(req.body);
            } catch (e) {
              req.body = {};
            }
          }
          const resMethods = {
            status: function (code) {
              res.statusCode = code;
              return this;
            },
            send: function (data) {
              res.end(typeof data === 'string' ? data : JSON.stringify(data));
            },
            json: function (obj) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(obj));
            }
          };

          Object.assign(res, resMethods);

          let idx = 0;
          const next = async () => {
            if (idx < this.middlewares.length) {
              const mw = this.middlewares[idx++];
              await mw(req, res, next);
            } else {
              this.handleRequest(req, res);
            }
          };
          await next();
        });
      } catch (err) {
        errorHandler(err, req, res);
      }
    });

    server.listen(port, callback);
  }

  handleRequest(req, res) {
    const method = req.method;
    const url = req.url.split('?')[0];

    const route = this.routes.find(r => r.method === method && r.path === url);
    if (route) {
      try {
        route.handler(req, res);
      } catch (err) {
        errorHandler(err, req, res);
      }
    } else {
      res.statusCode = 404;
      res.end('Не найдено');
    }
  }
}

module.exports = App;
