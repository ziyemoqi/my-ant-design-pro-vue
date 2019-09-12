<template>
  <div class="main">
    <a-form
      :form="form"
      class="user-layout-login"
      ref="formLogin"
      id="formLogin"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          size="large"
          v-decorator="['username',validatorRules.username,{ validator: this.handleUsernameOrEmail }]"
          type="text"
          placeholder="请输入帐户名"
        >
        <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          v-decorator="['password',validatorRules.password]"
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入密码"
        >
        <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-row :gutter="0">
        <a-col :span="14">
          <a-form-item>
            <a-input
              v-decorator="['inputCode',validatorRules.inputCode]"
              size="large"
              type="text"
              @change="inputCodeChange"
              placeholder="请输入验证码"
            >
              <a-icon
                slot="prefix"
                v-if=" inputCodeContent==verifiedCode "
                type="smile"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
              <a-icon slot="prefix" v-else type="frown" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <picture-verify-code @success="generateCode" style="float: right"></picture-verify-code>
        </a-col>
      </a-row>

      <a-form-item>
        <a-checkbox v-model="rememberMe">自动登陆</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >忘记密码</router-link>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="submitting"
        >确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import PictureVerifyCode from '@/components/user/PictureVerifyCode'

export default {
  components: {
    PictureVerifyCode
  },
  data() {
    return {
      submitting: false,
      // loginType: 0 email, 1 username
      loginType: 0,
      form: this.$form.createForm(this),
      rememberMe: true,
      validatorRules: {
        username: { rules: [{ required: true, message: '请输入用户名!', validator: 'click' }] },
        password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] },
        inputCode: { rules: [{ required: true, message: '请输入验证码!' }, { validator: this.validateInputCode }] }
      },
      verifiedCode: '',
      inputCodeContent: '',
      inputCodeNull: true
    }
  },
  created() {
    Vue.ls.remove(ACCESS_TOKEN)
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    generateCode(value) {
      this.verifiedCode = value.toLowerCase()
    },
    handleUsernameOrEmail(rule, value, callback) {
      let regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        this.loginType = 0
      } else {
        this.loginType = 1
      }
      callback()
    },
    handleSubmit(e) {
      e.preventDefault()
      let that = this
      this.form.validateFields(async (err, values) => {
        if (!err) {
          that.submitting = true
          let loginParams = {
            ...values,
            remember_me: that.rememberMe,
            loginType: that.loginType
          }
          that
            .Login(loginParams)
            .then(res => {
              that.loginSuccess()
            })
            .catch(err => {
              that.loginFailed(err)
            })
        }
      })
    },
    loginSuccess() {
      this.submitting = false
      this.$router.push({ name: 'dashboard' })
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`
      })
    },
    loginFailed(err) {
      this.$notification['error']({
        message: '登录失败',
        description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.submitting = false
    },

    validateInputCode(rule, value, callback) {
      if (!value || this.verifiedCode === this.inputCodeContent) {
        callback()
      } else {
        callback(new Error('您输入的验证码不正确!'))
      }
    },
    
    inputCodeChange(e) {
      this.inputCodeContent = e.target.value
      if (!e.target.value || e.target.value === 0) {
        this.inputCodeNull = true
      } else {
        this.inputCodeContent = this.inputCodeContent.toLowerCase()
        this.inputCodeNull = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
<style>
.valid-error .ant-select-selection__placeholder {
  color: #f5222d;
}
</style>
