'use strict';
const path = require('path');
const name = 'Vue Admin';
const port = 8088;

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',// 打包后的index.html中的js和css的引入路径
  outputDir: 'dist',// 输出目录
  assetsDir: 'static', // 打包后的css js存放路径
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/dev-api': {
        target: 'http://localhost:8080/Download/update', // 将/dev-api开头的路径 代理为 http://localhost:8080/Download/update/dev-api/user.txt
        changeOrigin: true,
        logLevel: 'debug', // 可在控制台查看接口代理的信息,[HPM] POST /dev-api/user.txt ~> http://localhost:8080/Download/update
        pathRewrite: { // 请求路径的重写规则
          '^/dev-api': '' // 将路径/dev-api重设为空，[HPM] Rewriting path from "/dev-api/user.txt" to "/user.txt"
        }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      }
    }
  },
  chainWebpack(config) {
    config.module.rule('svg').exclude.add(resolve('src/common/icons')).end()
    config.module.rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/common/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      }).end()
    // set preserveWhitespace
    config.module.rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      }).end()
  }
}
