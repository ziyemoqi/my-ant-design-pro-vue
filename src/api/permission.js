import { get, deleteAction, put, post } from '@/api/manage'


/**
 * 根据Token获取权限
 * @param {*} params 
 */
export function queryPermissionsByToken(params) {
    return get("/sysPermission/getUserPermissionByToken", params)
}

/**
 * 加载所有有效权限数据
 * @param {*} params 
 */
export function getPermissionList() {
    return get("/sysPermission/list")
}



// const getPermissionList = (params)=>get("/sysPermission/list",params);

// export {
//     getPermissionList
// }