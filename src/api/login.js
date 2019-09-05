// y
import api from './index'
import { service } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
// export function login (parameter) {
//   return service({
//     url: '/auth/login',
//     method: 'post',
//     data: parameter
//   })
// }

export function login (payload) {
  console.log(payload)
  return service.post('/sys/login', payload)
}

export function getSmsCaptcha (parameter) {
  return service({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return service({
    url: '/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return service({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return service({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
