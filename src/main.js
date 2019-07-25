import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { XTable, XHeader, Group, Cell, XButton, Toast, ToastPlugin, Confirm, Scroller } from 'vux'

Vue.component('x-table', XTable)
Vue.component('x-header', XHeader)
Vue.component('group', Group)
Vue.component('cell', Cell)
Vue.component('x-button', XButton)
Vue.component('toast', Toast)
Vue.component('confirm', Confirm)
Vue.component('scroller', Scroller)

Vue.use(ToastPlugin, {position: 'top'})
Vue.config.productionTip = false


import FastClick from 'fastclick'
FastClick.attach(document.body);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Date.prototype.Format = function(fmt) {
    let o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(let k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
