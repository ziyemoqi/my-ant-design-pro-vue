import { get} from '@/api/manage'

//获取系统访问量
const getLoginfo = (params)=>get("/sys/loginfo",params)

export {
    getLoginfo
}