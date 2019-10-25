import Vue from 'vue'
import { login, logout } from '@/api/user'
import { queryPermissionsByToken } from '@/api/permission'
import { ACCESS_TOKEN, USER_NAME, USER_INFO, USER_AUTH, SYS_BUTTON_AUTH } from "@/store/mutation-types"
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    userName: '',
    nickName: '',
    welcome: '',
    picture: '',
    permissionList: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { userName, nickName, welcome }) => {
      state.userName = userName
      state.nickName = nickName
      state.welcome = welcome
    },
    SET_PICTURE: (state, picture) => {
      state.picture = picture
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code == '200') {
            let result = response.data
            let userInfo = result.userInfo
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_NAME, userInfo.userName, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            commit('SET_INFO', userInfo)
            commit('SET_NAME', { userName: userInfo.userName, nickName: userInfo.nickName, welcome: welcome() })
            commit('SET_PICTURE', userInfo.picture)
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 获取用户权限信息
    GetPermissionList({ commit }) {
      return new Promise((resolve, reject) => {
        let v_token = Vue.ls.get(ACCESS_TOKEN)
        let params = { token: v_token }
        queryPermissionsByToken(params).then(response => {
          if (response.code == '200') {
            let menuData = response.data.menu;
            let authData = response.data.auth;
            let allAuthData = response.data.allAuth;
            sessionStorage.setItem(USER_AUTH, JSON.stringify(authData));
            sessionStorage.setItem(SYS_BUTTON_AUTH, JSON.stringify(allAuthData));
            if (menuData && menuData.length > 0) {
              commit('SET_PERMISSIONLIST', menuData)
            } else {
              reject('getPermissionList: permissions must be a non-null array !')
            }
            resolve(response)
          } else {
            console.log(response.msg)
            reject(response.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        let logoutToken = state.token;
        commit('SET_TOKEN', '')
        commit('SET_PERMISSIONLIST', [])
        Vue.ls.remove(ACCESS_TOKEN)
        logout(logoutToken).then(() => {
          console.log(123)
          resolve()
        }).catch(() => {
          console.log(1234)
          resolve()
        })
      })
    },

  }
}

export default user
