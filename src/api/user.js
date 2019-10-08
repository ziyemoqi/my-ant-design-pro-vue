import { axios } from '@/utils/request'
import { get,post} from '@/api/manage'

/**
 * 登录
 * @param {*} parameter 
 */
export function login(parameter) {
  return axios({
    url: '/sysUser/login',
    method: 'post',
    data: parameter
  })
}

/**
 * 登出
 * @param {*} logoutToken 
 */
export function logout(logoutToken) {
  return axios({
    url: '/sysUser/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Access-Token':  logoutToken
    }
  })
}

/**
 * 根据Token获取权限
 * @param {*} params 
 */
export function queryPermissionsByToken(params){
  return get("/sysPermission/getUserPermissionByToken",params)
}



/**
 * 临时接口 -- 测试websocket 推送
 * @param {*} params 
 */
export function tempApi2(params) {
  return axios({
    url: '/remind/remind-message/sendUser',
    method: 'post',
    data: params
  })
}