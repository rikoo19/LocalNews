const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/news',
    createProxyMiddleware({
      target: 'https://gnews.io',
      changeOrigin: true,
      pathRewrite: (path, req) => {
        const query = req.url.split('?')[1];
        const params = new URLSearchParams(query);
        const q = params.get('q');
        
        // Route to correct GNews endpoint based on whether there's a search query
        if (q) {
          return `/api/v4/search?${query}`;
        } else {
          return `/api/v4/top-headlines?${query}`;
        }
      },
    })
  );
};
