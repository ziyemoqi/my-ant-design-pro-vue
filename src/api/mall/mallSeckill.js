import { get, post,put,deleteAction } from '@/api/manage'

/**
 * 秒杀商品分页信息 
 * @param {*} params 
 */
export function page(params) {
    return get("/mallSeckill/page", params)
}

/**
 * 添加/更新秒杀商品
 * @param {*} params 
 */
export function save(params) {
    return post("/mallSeckill",params)
}

/**
 * 删除秒杀商品
 * @param {*} params 
 */
export function deleteById(params) {
    return deleteAction("/mallSeckill",params)
}

/**
 * 秒杀商品Link 
 * @param {*} params 
 */
export function linkInfo(params) {
    return get("/mallSeckill/mallSeckill", params)
}

/**
 * 执行秒杀
 * @param {*} params 
 */
export function execSeckill(params) {
    return put("/mallSeckill/execSeckill",params)
}
