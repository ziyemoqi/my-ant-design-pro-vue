import { axios } from '@/utils/request'
import { get,post} from '@/api/manage'

// 查询所有角色
const queryallRole = (params)=>get("/sysRole/queryall",params)


export {
    queryallRole
}