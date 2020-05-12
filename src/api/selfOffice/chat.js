import { get, post,put,deleteAction } from '@/api/manage'

// 发送消息
export function sendMessage(params) {
    return post("/chat/sendMessage", params)
}