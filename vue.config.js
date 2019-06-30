const Timestamp = new Date().getTime();

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/kshiw-accountBook/'
        : '/',
    outputDir: 'docs',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    chainWebpack: config => {
        // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
        config.output.filename(`name].[hash].${Timestamp}.js`)
        config.output.chunkFilename(`[name].[hash].${Timestamp}.js`)
    },
    configureWebpack: config => {
        require('@vux/loader').merge(config, {
            plugins: ['vux-ui', {
                name: 'less-theme',
                path: 'src/theme.less'
            }]
        })
    }
}
