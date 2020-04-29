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
          v-decorator="['loginName',validatorRules.loginName]"
          type="text"
          placeholder="Account"
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
          placeholder="Password"
        >
        <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-row :gutter="0">
        <a-col :span="14">
          <a-form-item>
            <a-input
                ref="code"
                 size="large"
                v-decorator="[
                  'verifyCode',
                  {rules: [{ required: true, message: '请输入验证码' }]}
                ]"
                placeholder="请输入验证码"
              ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <base-img class="verify-img" v-if="verifyImg" :src="verifyImg" @click.native="getVerifyCode"></base-img>
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
import { getVerifyCode } from '@/api/user'

export default {
  data() {
    return {
      submitting: false,
      form: this.$form.createForm(this),
      rememberMe: true,
      validatorRules: {
        loginName: { rules: [{ required: true, message: '请输入用户名!', validator: 'click' }] },
        password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] },
        inputCode: { rules: [{ required: true, message: '请输入验证码!' }] }
      },
      verifiedCode: '',
      verifyKey: '',
      verifyImg: '',
      inputCodeContent: '',
      inputCodeNull: true
    }
  },
  created() {
    Vue.ls.remove(ACCESS_TOKEN)
  },
  mounted () {
    this.getVerifyCode()
  },
  methods: {
    async getVerifyCode () {
      let { data: { verifyKey, verifyFile } } = await getVerifyCode()
      this.verifyImg = 'data:image/jpg;base64,' + verifyFile
      this.verifyKey = verifyKey
    },
    ...mapActions(['Login', 'Logout']),
    generateCode(value) {
      this.verifiedCode = value.toLowerCase()
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
            verifyKey: this.verifyKey
          }
          that.Login(loginParams)
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
        description:  err.msg || '系统错误，请稍后再试',
        duration: 4
      })
      this.submitting = false
    },
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
 .verify-img {
    float: right;
    width: 130px;
    height: 40px;
    cursor: pointer;
    /deep/ .base-img {
      height: 100%;
      .base-img-item {
        height: 100%;
      }
    }
  }
</style>
