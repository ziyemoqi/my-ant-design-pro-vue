import { get, post,put } from '@/api/manage'

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

/**
 * 取消订单
 * @param {*} params 
 */
export function cancelOrder(params) {
    return post("/mallOrder/cancelOrder",params)
}