import { get} from '@/api/manage'

//获取系统访问量
const getLogInfo = (params)=>get("/sysLog/logInfo",params)

//查询系统日志
const logPage = (params)=>get("/sysLog/logPage",params)

export {
    logPage,
    getLogInfo
}
