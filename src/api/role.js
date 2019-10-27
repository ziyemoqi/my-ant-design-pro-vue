import { axios } from '@/utils/request'
import { get,post} from '@/api/manage'

const queryall = (params)=>get("/sys/role/queryall",params)


export {
    queryall
}