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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
