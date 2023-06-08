const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

module.exports = {
  publicPath: '/freetraffic/',
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
        target: "http://cc-hwy.cmtest.xyz",
        secure:true,
        changeOrigin: true,
        pathRewrite: {
          // 路径重写，
          "^/apaas": "/apaas" // 替换target中的请求地址
        }
      },
    }
  }
};