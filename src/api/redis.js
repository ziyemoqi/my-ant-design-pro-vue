import { get, post,put,deleteAction } from '@/api/manage'

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

export {
    userPage,
    findUserById,
    edit,
    deleteById,
    add
}