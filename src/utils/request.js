import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { Modal} from 'ant-design-vue'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 10000
})

// request interceptor
service.interceptors.request.use(
  config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  if (config.method == 'get') {
    config.data = {
      _t: Date.parse(new Date()) / 1000,
      ...config.data
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})


// response interceptor
service.interceptors.response.use((response) => {
  const res = response.data
  const token = response.headers['authorization']
  if (token) {
    Vue.ls.set(ACCESS_TOKEN, token, 24 * 60 * 60 * 1000)
  }
    if (res.code !== 200) {
      // 登录验证
      if (res.code === 40103) {
        Modal.error({
          title: '登录已过期',
          content: '很抱歉，登录信息已过期，请重新登录',
          okText: '重新登录',
          mask: false,
          onOk: () => {
            store.dispatch('Logout').then(() => {
              Vue.ls.remove(ACCESS_TOKEN)
              window.location.reload()
            })
          }
        })
      } else {
        return response.data
      }
    } else {
      return response.data
    }
}, err=>{
  if (axios.isCancel(error)) {
    console.log('request cancel')
  } else {
    let { response } = error
    return response ? response.data : Promise.reject(error)
  }
})

const installer = {
  vm: {},
  install(Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
