import { axios } from '@/utils/request'
import { get} from '@/api/manage'

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
    url: '/sys/logout',
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
  return get("/sys/permission/getUserPermissionByToken",params)
}

// const queryPermissionsByUser = (params)=>get("/sys/permission/getUserPermissionByToken",params);

// export {
//   queryPermissionsByUser
// }
