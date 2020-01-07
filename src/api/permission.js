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

/**
 * 加载权限树
 * @param {*} params 
 */
const queryTreeList = (params)=>get("/sysPermission/queryTreeList",params)

/**
 * 编辑
 * @param {*} params 
 */
export function editPermission(params) {
    return put("/sysPermission/edit",params)
}

/**
 * 新增
 * @param {*} params 
 */
export function addPermission(params) {
    return post("/sysPermission/add",params)
}

/**
 * 删除
 */
export function delete_(params) {
    return deleteAction("/sysPermission/delete",params)
}

/**
 * 批量删除
 * @param {*} params 
 */
export function deleteBatch(params) {
    return deleteAction("/sysPermission/deleteBatch",params)
}


/**
 * 加载权限树Map
 * @param {*} params 
 */
const permissionMapTree = (params)=>get("/sysPermission/permissionMapTree",params)
export {
    queryTreeList,
    permissionMapTree
}