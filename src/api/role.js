import { axios } from '@/utils/request'
import { get,post} from '@/api/manage'

const queryall = (params)=>get("/sysRole/queryall",params)


export {
    queryall
}