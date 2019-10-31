import { axios } from '@/utils/request'
import { get, post } from '@/api/manage'

// 查询所有角色 用于用于添加时选择角色
const queryallRole = (params)=>get("/sysRole/queryall",params)
// 分页查询数据
const queryallRolePage = (params) => post("/sysRole/queryPageAll", params)

//   url: {
//     delete: '/sys/role/delete',
//     deleteBatch: '/sys/role/deleteBatch',
//   }

export {
    queryallRole,
    queryallRolePage
}