import Vue from 'vue'
import { USER_INFO } from '@/store/mutation-types'
const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  headImg: state => { state.user.headImg = Vue.ls.get(USER_INFO).headImg; return state.user.headImg },
  username: state => { state.user.userName = Vue.ls.get(USER_INFO).userName; return state.user.userName },
  welcome: state => state.user.welcome,
  permissionList: state => state.user.permissionList,
  userInfo: state => { state.user.info = Vue.ls.get(USER_INFO); return state.user.info },
  addRouters: state => state.permission.addRouters
}

export default getters
