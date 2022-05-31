const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://safesign-server.wbx.ninja',
      changeOrigin: true,
    })
  );
};