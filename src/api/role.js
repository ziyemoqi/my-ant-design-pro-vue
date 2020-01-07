import { get, post,put,deleteAction } from '@/api/manage'

// 查询所有角色 用于添加时选择角色
const roleList = (params)=>get("/sysRole/roleList",params)
// 分页查询数据
const rolePage = (params) => get("/sysRole/rolePage", params)
// 角色添加
const add = (params)=>post("/sysRole/add",params)
// 角色修改
const edit = (params)=>put("/sysRole/edit",params)
// 删除
const deleteByRoleId  = (params)=>deleteAction("/sysRole/delete",params)
// 批量删除
export function deleteBatch(params) {
  return deleteAction("/sysRole/deleteBatch",params)
}
// 重复校验
const duplicateCheck = (params)=>get("/sysRole/duplicate",params)
// 加载角色授权
const queryRolePermission = (params)=>get("/sysRole/rolePermission",params)
// 保存角色授权
const saveRolePermission = (params)=>post("/sysRole/rolePermission",params)

export {
    roleList,
    rolePage,
    add,
    edit,
    deleteByRoleId,
    duplicateCheck,
    queryRolePermission,
    saveRolePermission
}