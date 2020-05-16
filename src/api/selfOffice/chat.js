import { get, post,put,deleteAction } from '@/api/manage'

// 发送消息
export function sendMessage(params) {
    return post("/chat/sendMessage", params)
}

/**
 * 聊天记录
 * @param {*} params 
 */
export function init(params) {
    return get("/chat/init", params)
}