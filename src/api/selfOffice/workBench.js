import { get, post,put,deleteAction } from '@/api/manage'

/**
 * 工作台信息 
 * @param {*} params 
 */
export function list(params) {
    return get("/workBench", params)
}

/**
 * 添加信息
 * @param {*} params 
 */
export function save(params) {
    return post("/workBench",params)
}


/**
 * 删除信息
 * @param {*} params 
 */
export function delete_(params) {
    return deleteAction("/workBench",params)
}