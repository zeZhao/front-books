'use strict'
const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
const port = process.env.port || process.env.npm_config_port || 5544 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'dev',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/stage-api': {
                // target: 'http://10.10.0.4:8601',
                target: process.env.VUE_APP_HOST_URL,
                // target: 'http://192.168.12.144:18246',
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                pathRewrite: {
                    '^/api': '' //重写接口访问
                }
            }
        },
    },
}
