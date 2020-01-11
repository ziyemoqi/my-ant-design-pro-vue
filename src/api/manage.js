import { axios } from '@/utils/request'

const api = {
  user: '/api/user',
  role: '/api/role',
  service: '/api/service',
  permission: '/api/permission',
  permissionNoPager: '/api/permission/no-pager'
}

export default api

//post
export function post(url,parameter) {
  return axios({
    url: url,
    method:'post' ,
    data: parameter
  })
}


//put
export function put(url,parameter) {
  return axios({
    url: url,
    method:'put',
    data: parameter
  })
}

//get
export function get(url,parameter) {
  return axios({
    url: url,
    method: 'get',
    params: parameter
  })
}

//delete
export function deleteAction(url,parameter) {
  return axios({
    url: url,
    method: 'delete',
    params: parameter
  })
}


//post method= {post | put}
export function httpAction(url,parameter,method) {
  return axios({
    url: url,
    method:method ,
    data: parameter
  })
}


