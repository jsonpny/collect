
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    open: true,
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://10.3.251.163',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      },
      '/root': {
        target: 'http://10.3.251.163',
        changeOrigin: true,
        pathRewrite: { '^/root': '' }
      }
    }
  }
}
