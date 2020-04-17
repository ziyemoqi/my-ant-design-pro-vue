import { get,post,deleteAction,put} from '@/api/manage'

// =========  导入导出  =========

/**
 * 分页信息 
 * @param {*} params 
 */
export function page(params) {
    return get("/demo/page", params)
}

