import { get, post,put,deleteAction } from '@/api/manage'

/**
 * 我的消息分页信息
 * @param {*} params 
 */
export function page(params) {
    return get("/messageReceive", params)
}


/**
 * 标注已读
 * @param {*} params 
 */
export function readMessage(params) {
    return put("/messageReceive", params)
}

/**
 * 发布消息
 * @param {*} params 
 */
export function sendAll(params) {
    return post("/message/sendAll", params)
}
