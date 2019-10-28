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
 * 根据部门ID加载有效用户
 * @param {*} params 
 */
export function userList(params){
  return post("/sysUser/departUserList",params)
}

const addUser = (params)=>postAction("/sysUser/add",params);
const editUser = (params)=>putAction("/sysUser/edit",params);

export {
  addUser,
  editUser
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



// 方法多种方式
//   1、
//       import { get,deleteAction,put,post} from '@/api/manage'
//       const queryTreeList = (params)=>get("/sys/permission/queryTreeList",params);
//       export {
//           queryTreeList,
//       }
//   2、
//       import { get,post} from '@/api/manage'
//       export function queryPermissionsByToken(params){
//           return get("/sysPermission/getUserPermissionByToken",params)
//       }
//   3、
//       export function login(parameter) {
//       return axios({
//           url: '/sysUser/login',
//           method: 'post',
//           data: parameter
//       })
//       }