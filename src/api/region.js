import { get, post,put,deleteAction } from '@/api/manage'

/**
 * 区域级联信息 
 * @param {*} params 
 */
export function regionList(params) {
    return get("/region/list", params)
}
