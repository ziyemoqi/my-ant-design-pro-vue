import { get,post,deleteAction,put} from '@/api/manage'

// =========  部门管理API  =========
// 加载部门树
const queryDepartTreeList = (params)=>get("/sysDept/queryTreeList",params)
// 查询子级部门
const childrenDept = (params)=>get("/sysDept/childrenDept",params)
// 搜索
const searchByKeywords = (params)=>get("/sysDept/searchBy",params)
// 根据主键查询详情
const queryIdTree = (params)=>get("/sysDept/queryIdTree",params)
// 编辑
const editByDeptId = (params)=>put("/sysDept/edit",params)
// 部门添加
const addDept = (params)=>post("/sysDept/add",params)
// 删除
const deleteByDepartId  = (params)=>deleteAction("/sysDept/delete",params)
// 批量删除
const deleteBatch  = (params)=>deleteAction("/sysDept/deleteBatch",params)
// 
const queryParentName   = (params)=>get("/sys/sysDepart/queryParentName",params)


export {
    queryDepartTreeList,
    childrenDept,
    queryIdTree,
    queryParentName,
    searchByKeywords,
    deleteByDepartId,
    editByDeptId,
    addDept,
    deleteBatch
}

