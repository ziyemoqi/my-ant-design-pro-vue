import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import {Modal,notification} from 'ant-design-vue'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/jeecg-boot', // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    console.log('------异常响应------', token)
    console.log('------异常响应------', error.response.status)
    switch (error.response.status) {
      case 403:
        notification.error({message: '系统提示', description: '拒绝访问', duration:4})
        break
      case 500:
        if (token && data.message === 'Token失效，请重新登录') {
          Modal.error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              store.dispatch('Logout').then(() => {
                Vue.ls.remove(ACCESS_TOKEN)
                window.location.reload()
              })
            }
          })
        }
        break
      case 404:
        notification.error({message: '系统提示', description: '很抱歉，资源未找到!', duration: 4})
        break
      case 504:
        notification.error({message: '系统提示', description: '网络超时'})
        break
      case 401:
        notification.error({message: '系统提示', description: '未授权，请重新登录', duration: 4})
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
}
// / request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ 'X-Access-Token' ] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  if(config.method=='get'){
    config.params = {
      _t: Date.parse(new Date())/1000,
      ...config.params
    }
  }
  return config
},(error) => {
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
    return response.data
  }, err)

const installer = {
  vm: {},
  install (Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

// =======================================================================================
// request interceptor
// service.interceptors.request.use(config => {
//   const token = Vue.ls.get(ACCESS_TOKEN)
//   if (token) {
//     config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
//   }
//   return config
// }, err)

// // response interceptor
// service.interceptors.response.use((response) => {
//   return response.data
// }, err)

// // 封装get请求
// export function get (url, params = {}) {
//   params.t = new Date().getTime() // get方法加一个时间参数,解决ie下可能缓存问题.
//   return service({
//     url: url,
//     method: 'get',
//     headers: {
//     },
//     params
//   })
// }

// // 封装post请求
// export function post (url, data = {}) {
//   const sendObject = {
//     url: url,
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     data: data
//   }
//   sendObject.data = JSON.stringify(data)
//   return service(sendObject)
// }

// // 封装put方法 (resfulAPI常用)
// export function put (url, data = {}) {
//   return service({
//     url: url,
//     method: 'put',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     data: JSON.stringify(data)
//   })
// }
// // 删除方法(resfulAPI常用)
// export function deletes (url) {
//   return service({
//     url: url,
//     method: 'delete',
//     headers: {}
//   })
// }

// const installer = {
//   vm: {},
//   install (Vue) {
//     Vue.use(VueAxios, service)
//   }
// }

export {
  installer as VueAxios,
  service
}
