module.exports = {
  plugins: {
      'autoprefixer': {
          browsers: ['Android >= 4.0', 'iOS >= 7']
      },
      'postcss-pxtorem': {
          rootValue: 75,//会把css中的px除以这个数变为rem，即75px变为1rem，150px变为2rem
          unitPrecision: 6,//px变为rem后保留的小数位数
          propList: ['*'],//对哪些属性生效，未被匹配的属性不会把px替换为rem
          selectorBlackList: ['vux-', 'weui-', 'dp-', 'scroller-'],//选择器黑名单，即该名单中的px不被替换为rem
          replace: true,//
          mediaQuery: false,//媒体查询( @media screen 之类的)中不生效
          minPixelValue: 3 //px小于6px时不替换为rem
      }
  }
}
