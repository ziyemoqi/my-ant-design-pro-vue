import { get, post,put,deleteAction } from '@/api/manage'

// ========== redis 基础操作 ==========
// 分页查询数据
const userPage = (params) => get("/redisPractice/redisUser/userPage", params)
// 根据用户ID查询
const findUserById = (params) => get("/redisPractice/redisUser/findUserById", params)
// 修改
const edit = (params)=>put("/redisPractice/redisUser/updateUser",params)
// 删除
const deleteById  = (params)=>deleteAction("/redisPractice/redisUser/deleteUserById",params)
// 添加
const add = (params)=>post("/redisPractice/redisUser/add",params)

// ========== redis pub sub ==========
// 分页查询数据
const pubSubPage = (params) => get("/redisPractice/redisPubSub/pubSubPage", params)
// 发布消息
const sendMessage = post("/redisPractice/redisPubSub/sendMessage")


export {
    userPage,
    findUserById,
    edit,
    deleteById,
    add,
    pubSubPage,
    sendMessage
}