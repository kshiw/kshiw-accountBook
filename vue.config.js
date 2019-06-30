const Timestamp = new Date().getTime();
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const isPro = process.env.NODE_ENV === 'production'
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/kshiw-accountBook/'
        : '/',
    outputDir: 'docs',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: config => {
        // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
        config.output.filename(`[name].[hash].${Timestamp}.js`)
        config.output.chunkFilename(`[name].[hash].${Timestamp}.js`)
    },
    configureWebpack: config => {
        const plugins = []
        require('@vux/loader').merge(config, {
            plugins: ['vux-ui', {
                name: 'less-theme',
                path: 'src/theme.less'
            }]
        })
        config.plugins = [...config.plugins, ...plugins]
    },
    css: {
        // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
        extract: true,

        // 是否开启 CSS source map？
        sourceMap: false,

        // 为预处理器的 loader 传递自定义选项。比如传递给
        // sass-loader 时，使用 `{ sass: { ... } }`。
        loaderOptions: {},

        // 为所有的 CSS 及其预处理文件开启 CSS Modules。
        // 这个选项不会影响 `*.vue` 文件。
        modules: false
    },
}
