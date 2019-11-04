import { axios } from '@/utils/request'
import { get,post,put,deleteAction} from '@/api/manage'

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
// 用户添加
const addUser = (params)=>post("/sysUser/add",params)
// 用户修改
const editUser = (params)=>put("/sysUser/edit",params)

/**
 * 删除
 */
export function delete_(params) {
  return deleteAction("/sysUser/delete",params)
}

/**
* 批量删除
* @param {*} params 
*/
export function deleteBatch(params) {
  return deleteAction("/sysUser/deleteBatch",params)
}
// 唯一性检测
const checkIsOnly = (params)=>get("/sysUser/checkIsOnly",params)
// 查询用户角色表里的所有信息
const queryUserRoleMap = (params)=>get("/sysUser/queryUserRoleMap",params)
// 查询用户的角色列表
const queryUserRole = (params)=>get("/sysUser/queryUserRole",params);


export {
  addUser,
  editUser,
  checkIsOnly,
  queryUserRoleMap,
  queryUserRole
}

/**
 * 临时接口 -- 测试websocket 推送
 * @param {*} params 
 */
export function tempApi2(params) {
  return axios({
    url: '/remindMessage/sendUser',
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