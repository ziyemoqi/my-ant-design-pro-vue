import { get,post,deleteAction,put} from '@/api/manage'

// =========  部门管理API  =========
// 加载部门树
const queryDepartTreeList = (params)=>get("/sysDept/queryTreeList",params)
const searchByKeywords   = (params)=>get("/sysDept/searchBy",params)
const queryIdTree = (params)=>get("/sysDept/queryIdTree",params)
const editByDeptId = (params)=>put("/sysDept/edit",params)

// 删除
const deleteByDepartId   = (params)=>deleteAction("/sysDept/delete",params)
// 批量删除
export function deleteBatch(params) {
    return deleteAction("/sysDept/deleteBatch",params)
  }

const queryParentName   = (params)=>get("/sys/sysDepart/queryParentName",params)


export {
  queryDepartTreeList,
    queryIdTree,
    queryParentName,
    searchByKeywords,
    deleteByDepartId,
    editByDeptId
}

