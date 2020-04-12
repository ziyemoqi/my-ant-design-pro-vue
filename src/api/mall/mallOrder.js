import { get, post,put,deleteAction } from '@/api/manage'

/**
 * 订单分页信息 
 * @param {*} params 
 */
export function page(params) {
    return get("/mallOrder/page", params)
}

/**
 * 生成订单
 * @param {*} params 
 */
export function createOrder(params) {
    return post("/mallOrder/createOrder",params)
}