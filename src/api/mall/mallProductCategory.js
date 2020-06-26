import { get, post,put,deleteAction } from '@/api/manage'

/**
 * 类目树分页信息 
 * @param {*} params 
 */
export function classTree(params) {
    return get("/mallProductCategory/classTree", params)
}

/**
 * 子级类目信息 
 * @param {*} params 
 */
export function childrenClass(params) {
    return get("/mallProductCategory/childrenClass", params)
}

/**
 * 添加类目
 * @param {*} params 
 */
export function save(params) {
    return post("/mallProductCategory",params)
}


/**
 * 删除商品
 * @param {*} params 
 */
export function delete_(params) {
    return deleteAction("/mallProductCategory",params)
}

/**
 * 级联类目信息
 * @param {*} params 
 */
export function classList(params) {
    return get("/mallProductCategory/classList", params)
}
