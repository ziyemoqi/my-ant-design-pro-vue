import { get, post,put,deleteAction } from '@/api/manage'

/**
 * 商品分页信息 
 * @param {*} params 
 */
export function page(params) {
    return get("/mallProduct/page", params)
}

/**
 * 添加商品
 * @param {*} params 
 */
export function add(params) {
    return post("/mallProduct",params)
}

/**
 * 修改商品信息
 * @param {*} params 
 */
export function updateGood(params) {
    return put("/mallProduct",params)
}

/**
 * 删除商品
 * @param {*} params 
 */
export function delete_(params) {
    return deleteAction("/mallProduct",params)
}