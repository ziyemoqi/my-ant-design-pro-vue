import { get, post,put,deleteAction } from '@/api/manage'

/**
 * 收货地址分页信息 
 * @param {*} params 
 */
export function page(params) {
    return get("/mallShipping/page", params)
}

/**
 * 添加收货地址
 * @param {*} params 
 */
export function save(params) {
    return post("/mallShipping",params)
}


/**
 * 删除收货地址
 * @param {*} params 
 */
export function delete_(params) {
    return deleteAction("/mallShipping",params)
}

/**
 * 查询所有收货地址
 * @param {*} params 
 */
export function shipingList(params) {
    return get("/mallShipping/shipingList",params)
}
