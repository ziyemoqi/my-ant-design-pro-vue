import { get, post,put,deleteAction } from '@/api/manage'

/**
 * 类目树分页信息 
 * @param {*} params 
 */
export function classTree(params) {
    return get("/mallGoodClass/classTree", params)
}

/**
 * 子级类目信息 
 * @param {*} params 
 */
export function childrenClass(params) {
    return get("/mallGoodClass/childrenClass", params)
}

/**
 * 添加类目
 * @param {*} params 
 */
export function add(params) {
    return post("/mallGoodClass",params)
}

/**
 * 修改类目信息
 * @param {*} params 
 */
export function updateClass(params) {
    return put("/mallGoodClass",params)
}

/**
 * 删除商品
 * @param {*} params 
 */
export function delete_(params) {
    return deleteAction("/mallGoodClass",params)
}

/**
 * 级联类目信息
 * @param {*} params 
 */
export function classList(params) {
    return get("/mallGoodClass/classList", params)
}
