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
      "/apaas": {
        target: "http://139.196.180.61:80",
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