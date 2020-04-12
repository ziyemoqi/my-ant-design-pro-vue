import { get, post,put,deleteAction } from '@/api/manage'

/**
 * 商品分页信息 
 * @param {*} params 
 */
export function page(params) {
    return get("/mallGood/page", params)
}

/**
 * 添加商品
 * @param {*} params 
 */
export function add(params) {
    return post("/mallGood",params)
}

/**
 * 修改商品信息
 * @param {*} params 
 */
export function updateGood(params) {
    return put("/mallGood",params)
}

/**
 * 删除商品
 * @param {*} params 
 */
export function delete_(params) {
    return deleteAction("/mallGood",params)
}