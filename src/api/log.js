import { get} from '@/api/manage'

//获取系统访问量
const getLogInfo = (params)=>get("/sysLog/logInfo",params)

export {
    getLogInfo
}
