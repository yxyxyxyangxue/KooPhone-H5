const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },
  devServer: {
    proxy: {
      // 配置多个代理
      "/api": {
        target: "http://112.125.90.247:81",
        secure:true,
        changeOrigin: true,
        pathRewrite: {
          // 路径重写，
          "^/api": "" // 替换target中的请求地址
        }
      },
    }
  }
};