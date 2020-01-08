import { get,post,deleteAction,put} from '@/api/manage'

// =========  字典管理API  =========
// 加载字典树
const dictTree = (params)=>get("/sysDict/dictTree",params)
// 查询子级字典
const childrenDict = (params)=>get("/sysDict/childrenDict",params)
// 编辑
const edit = (params)=>put("/sysDict/edit",params)
// 字典添加
const add = (params)=>post("/sysDict/add",params)
// 删除
const deleteById  = (params)=>deleteAction("/sysDict/delete",params)
// 批量删除
const deleteBatch  = (params)=>deleteAction("/sysDict/deleteBatch",params)

export {
    dictTree,
    childrenDict,
    deleteById,
    edit,
    add,
    deleteBatch
}

