const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // 禁用 parallel 构建以避免路径中特殊字符 (#) 导致的问题
  parallel: false,
  // 设置为相对路径，使得可以直接打开 dist/index.html
  publicPath: './'
})

