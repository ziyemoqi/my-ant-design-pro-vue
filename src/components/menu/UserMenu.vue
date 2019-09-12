<template>
  <div class="user-wrapper" :class="theme">
    <!-- 客服支持 -->
    <!-- <span class="action">
      <a class="logout_title" target="_blank" href="http://jeecg-boot.mydoc.io">
        <a-icon type="question-circle-o"></a-icon>
      </a>
    </span> -->
    <!-- 即时消息 -->
    <header-notice class="action"/>
    <!-- 设置 -->
    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" size="small" :src="getAvatar()"/>
        <span v-if="isDesktop()">欢迎您，{{ nickname() }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="0">
          <router-link :to="{ name: 'account-center' }">
            <a-icon type="user"/>
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1">
          <router-link :to="{ name: 'account-settings-base' }">
            <a-icon type="setting"/>
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2" @click="updatePassword">
          <a-icon type="unlock" />
          <span>密码修改</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <!-- 登出 -->
    <span class="action">
      <a class="logout_title" href="javascript:;" @click="handleLogout">
        <a-icon type="logout"/>&nbsp;
        <span v-if="isDesktop()">&nbsp;退出登录</span>
      </a>
    </span>
    <user-password ref="userPassword"></user-password>
  </div>
</template>

<script>
import HeaderNotice from './UserMenuNotice'
import UserPassword from './UserMenuPassword'
import { mapActions, mapGetters } from 'vuex'
import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'UserMenu',
  mixins: [mixinDevice],
  components: {
    HeaderNotice,
    UserPassword
  },
  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    getAvatar () {
      return window._CONFIG['imgDomainURL'] + '/' + this.avatar()
    },
    handleLogout () {
      let that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that.Logout({}).then(() => {
            window.location.href = '/'
            // window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    },
    updatePassword () {
      const username = this.userInfo().username
      this.$refs.userPassword.show(username)
    }
  }
}
</script>

<style scoped>
  .logout_title {
    color: inherit;
    text-decoration: none;
  }
</style>
