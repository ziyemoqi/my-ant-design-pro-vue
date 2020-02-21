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

// ========= Redis Cache 2.0 (缓存过期时间) START ===========
// 设置缓存过期时间
const setExpireTime = (params)=>post("/redisPractice/redisUser/setExpireTime",params)
// 查看缓存是否过期
const expireState = (params) => get("/redisPractice/redisUser/expireState", params)

// ========== redis pub sub ==========
// 分页查询数据
const pubSubPage = (params) => get("/redisPractice/redisPubSub/pubSubPage", params)
// 发布消息
const sendMessage = (params) => post("/redisPractice/redisPubSub/sendMessage", params)

// ========= redis rank ============
// 初始化数据
const initRankData =  (params) => post("/redisPractice/redisRank/initRankData",params)
// 查询数据
const getData = (params) => get("/redisPractice/redisRank/getData", params)
//清除数据
const clearData =  (params) => post("/redisPractice/redisRank/clearData",params)
// 查询排行榜前10
const scoreTop10 = (params) => get("/redisPractice/redisRank/scoreTop10", params)
// 添加
const rankAdd = (params)=>post("/redisPractice/redisRank/add",params)
// 查询指定人的排名和分数
const userInfo = (params) => get("/redisPractice/redisRank/userInfo", params)
// 查询指定人的排名和分数
const scopeCount = (params) => get("/redisPractice/redisRank/scopeCount", params)
// 添加
const addScore = (params)=>post("/redisPractice/redisRank/addScore",params)


// ========= redis counter ============
// 实现自增序列号
const importDevice = (params)=>post("/redisPractice/redisCounter/importDevice",params)


export {
    userPage,
    findUserById,
    edit,
    deleteById,
    add,
    pubSubPage,
    sendMessage,
    setExpireTime,
    expireState,
    initRankData,
    getData,
    scoreTop10,
    rankAdd,
    userInfo,
    scopeCount,
    addScore,
    importDevice,
    clearData
}