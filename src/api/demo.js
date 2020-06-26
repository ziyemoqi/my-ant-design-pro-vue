import { get,post,deleteAction,put} from '@/api/manage'

// =========  导入导出  =========

/**
 * 分页信息 
 * @param {*} params 
 */
export function page(params) {
    return get("/demo/page", params)
}

// 添加/更新
export function save(params) {
    return post("/demo", params)
}
// 删除
export function deleteById(params) {
    return deleteAction("/demo", params)
}