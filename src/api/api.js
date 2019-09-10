import { get,deleteAction,put,post} from '@/api/manage'

////根路径
// const doMian = "/jeecg-boot/";
////图片预览请求地址
// const imgView = "http://localhost:8080/jeecg-boot/sys/common/view/";

//角色管理
const addRole = (params)=>post("/sys/role/add",params);
const editRole = (params)=>put("/sys/role/edit",params);
const checkRoleCode = (params)=>get("/sys/role/checkRoleCode",params);
const queryall = (params)=>get("/sys/role/queryall",params);

//用户管理
const addUser = (params)=>post("/sys/user/add",params);
const editUser = (params)=>put("/sys/user/edit",params);
const queryUserRole = (params)=>get("/sys/user/queryUserRole",params);
const getUserList = (params)=>get("/sys/user/list",params);
const frozenBatch = (params)=>put("/sys/user/frozenBatch",params);
//验证用户账号是否唯一
const checkUsername = (params)=>get("/sys/user/checkOnlyUser",params);
//改变密码
const changPassword = (params)=>put("/sys/user/changPassword",params);

//权限管理
const addPermission= (params)=>post("/sys/permission/add",params);
const editPermission= (params)=>put("/sys/permission/edit",params);
const getPermissionList = (params)=>get("/sys/permission/list",params);
const queryTreeList = (params)=>get("/sys/permission/queryTreeList",params);
const queryTreeListForRole = (params)=>get("/sys/role/queryTreeList",params);
const queryListAsync = (params)=>get("/sys/permission/queryListAsync",params);
const queryRolePermission = (params)=>get("/sys/permission/queryRolePermission",params);
const saveRolePermission = (params)=>post("/sys/permission/saveRolePermission",params);
const queryPermissionsByUser = (params)=>get("/sys/permission/getUserPermissionByToken",params);
const loadAllRoleIds = (params)=>get("/sys/permission/loadAllRoleIds",params);
const getPermissionRuleList = (params)=>get("/sys/permission/getPermRuleListByPermId",params);
const queryPermissionRule = (params)=>get("/sys/permission/queryPermissionRule",params);

// 部门管理
const queryDepartTreeList = (params)=>get("/sysdepart/sysDepart/queryTreeList",params);
const queryIdTree = (params)=>get("/sysdepart/sysDepart/queryIdTree",params);
const queryParentName   = (params)=>get("/sysdepart/sysDepart/queryParentName",params);
const searchByKeywords   = (params)=>get("/sysdepart/sysDepart/searchBy",params);
const deleteByDepartId   = (params)=>deleteAction("/sysdepart/sysDepart/delete",params);

//日志管理
const deleteLog = (params)=>deleteAction("/sys/log/delete",params);
const deleteLogList = (params)=>deleteAction("/sys/log/deleteBatch",params);

//数据字典
const addDict = (params)=>post("/sys/dict/add",params);
const editDict = (params)=>put("/sys/dict/edit",params);
const treeList = (params)=>get("/sys/dict/treeList",params);
const addDictItem = (params)=>post("/sys/dictItem/add",params);
const editDictItem = (params)=>put("/sys/dictItem/edit",params);

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params)=>get(`/sys/dict/getDictItems/${code}`,params);

//系统通告
const doReleaseData = (params)=>get("/sys/annountCement/doReleaseData",params);
const doReovkeData = (params)=>get("/sys/annountCement/doReovkeData",params);
//获取系统访问量
const getLoginfo = (params)=>get("/sys/loginfo",params);
//数据日志访问
// const getDataLogList = (params)=>get("/sys/dataLog/list",params);

// 根据部门主键查询用户信息
const queryUserByDepId = (params)=>get("/sys/user/queryUserByDepId",params);

// 查询用户角色表里的所有信息
const queryUserRoleMap = (params)=>get("/sys/user/queryUserRoleMap",params);
// 重复校验
const duplicateCheck = (params)=>get("/sys/duplicate/check",params);

export {
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  getUserList,
  queryall,
  frozenBatch,
  checkUsername,
  changPassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  queryUserByDepId,
  queryUserRoleMap,
  duplicateCheck,
  queryTreeListForRole,
}



