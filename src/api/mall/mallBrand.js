import { get, post,put,deleteAction } from '@/api/manage'

//查询商品品牌
const page = (params)=>get("/mallBrand/page",params)
// 添加
const add = (params)=>post("/mallBrand/add",params)
// 修改
const edit = (params)=>put("/mallBrand/update",params)
// 删除
const deleteById  = (params)=>deleteAction("/mallBrand/delete",params)

export {
    page,
    add,
    edit,
    deleteById
}