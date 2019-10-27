import { get,post,deleteAction} from '@/api/manage'

// =========  部门管理API  =========
const queryDepartTreeList = (params)=>get("/sysDept/queryTreeList",params)
const searchByKeywords   = (params)=>get("/sysDept/searchBy",params)
const queryIdTree = (params)=>get("/sysDept/queryIdTree",params)
const queryParentName   = (params)=>get("/sys/sysDepart/queryParentName",params)
const deleteByDepartId   = (params)=>deleteAction("/sys/sysDepart/delete",params)


export {
    queryDepartTreeList,
    queryIdTree,
    queryParentName,
    searchByKeywords,
    deleteByDepartId
}

