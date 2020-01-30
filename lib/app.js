class App {
  constructor() {
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }
  use(middleware) {
    this.routes.push({ handler: middleware });
  }
  serve(req, res) {
    const matchingHandlers = this.routes.filter(route =>
      matchRoute(route, req)
    );
    const next = function() {
      const ternaryCondition = 0;
      if (matchingHandlers.length === ternaryCondition) {
        return;
      }
      const route = matchingHandlers.shift();
      route.handler(req, res, next);
    };
    next();
  }
}

const matchRoute = function(route, req) {
  if (route.method) {
    return req.method === route.method && req.url.match(route.path);
  }
  return true;
};

module.exports = { App };
