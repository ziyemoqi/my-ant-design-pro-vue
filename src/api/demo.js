import { get,post,deleteAction,put} from '@/api/manage'

// =========  导入导出  =========

/**
 * 分页信息 
 * @param {*} params 
 */
export function page(params) {
    return get("/demo/page", params)
}

// 编辑
export function editById (params)  {
    return put("/demo/edit",params)
}
// 添加
export function add(params) {
    return post("/demo/add", params)
}
// 删除
export function deleteById(params) {
    return deleteAction("/demo/delete", params)
}