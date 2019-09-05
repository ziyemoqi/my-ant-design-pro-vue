// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import Storage from 'vue-ls'
import config from '@/defaultSettings'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

import './permission' // permission control
import './utils/filter' // global filter

Vue.config.productionTip = false
Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
