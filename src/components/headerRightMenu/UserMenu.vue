<template>
  <div class="user-wrapper" :class="theme">
    <!-- 客服支持 -->
    <span class="action">
      <a class="logout_title" target="_blank" href="https://github.com/Kroos-x">
        <a-icon type="question-circle-o"></a-icon>
      </a>
    </span>
    <!-- 即时消息 -->
    <notice class="action"/>
    <!-- 设置 -->
    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" size="small" :src="getHeadImg()"/>
        <span v-if="isDesktop()">欢迎您，{{ username() }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="0" @click="accountCenter">
            <a-icon type="user"/>
            <span>个人中心</span>
        </a-menu-item>
        <a-menu-item key="1" @click="accountSetting">
              <a-icon type="setting"/>
              <span>账户设置</span>
        </a-menu-item>
        <a-menu-item key="2" @click="updatePassword">
          <a-icon type="unlock" />
          <span>修改密码</span>
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
import Notice from './UserMenuNotice'
import UserPassword from './UserMenuPassword'
import { mapActions, mapGetters } from 'vuex'
import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'UserMenu',
  mixins: [mixinDevice],
  components: {
    Notice,
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
    ...mapGetters(['username', 'headImg', 'userInfo']),
    getHeadImg () {
      return process.env.VUE_APP_IMG + this.headImg()
    },
    // 退出登录
    handleLogout () {
      let that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {

          return that.Logout({}).then(() => {
            window.location.href = '/'
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
    // 个人中心
    accountCenter() {
      this.$message.warning('功能开发中,敬请期待!')
    },
    // 账号设置
    accountSetting () {
      this.$message.warning('功能开发中,敬请期待!')
    },
    // 修改密码
    updatePassword () {
      const sysUserId = this.userInfo().sysUserId
      this.$refs.userPassword.show(sysUserId)
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
