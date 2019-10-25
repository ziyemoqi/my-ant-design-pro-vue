一、拆分多文件
    逐渐消除api.js
    采用 xxx.js 多文件方式命名

二、方法多种方式
    1、
        import { get,deleteAction,put,post} from '@/api/manage'
        const queryTreeList = (params)=>get("/sys/permission/queryTreeList",params);
        export {
            queryTreeList,
        }
    2、
        import { get,post} from '@/api/manage'
        export function queryPermissionsByToken(params){
            return get("/sysPermission/getUserPermissionByToken",params)
        }
    3、
        export function login(parameter) {
        return axios({
            url: '/sysUser/login',
            method: 'post',
            data: parameter
        })
        }
