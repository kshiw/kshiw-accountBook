module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/kshiw-accountBook/'
        : '/',
    outputDir: 'docs',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    configureWebpack: config => {
        require('@vux/loader').merge(config, {
            plugins: ['vux-ui', {
                name: 'less-theme',
                path: 'src/theme.less'
            }]
        })
    }
}
