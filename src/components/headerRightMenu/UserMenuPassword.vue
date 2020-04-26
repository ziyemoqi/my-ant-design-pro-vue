<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="旧密码">
          <a-input type="password" placeholder="请输入旧密码" v-decorator="[ 'oldPassword', validatorRules.oldPassword]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="新密码">
          <a-input type="password" placeholder="请输入新密码" v-decorator="[ 'passWord', validatorRules.password]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="确认新密码">
          <a-input type="password" @blur="handleConfirmBlur" placeholder="请确认新密码" v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { put } from '@/api/manage'

export default {
  name: 'UserPassword',
  data () {
    return {
      title: '修改密码',
      modalWidth: 800,
      visible: false,
      confirmLoading: false,
      validatorRules: {
        oldPassword: {
          rules: [{
            required: true, message: '请输入旧密码!'
          }]
        },
        password: {
          rules: [{
            required: true, message: '请输入新密码!'
          }, {
            validator: this.validateToNextPassword
          }]
        },
        confirmpassword: {
          rules: [{
            required: true, message: '请确认新密码!'
          }, {
            validator: this.compareToFirstPassword
          }]
        }
      },
      confirmDirty: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      sysUserId: '',
      form: this.$form.createForm(this),
      url: 'sysUser/updatePassword',
    }
  },
  methods: {
    show (sysUserId) {
      if (!sysUserId) {
        this.$message.warning('当前系统无登陆用户!')
      } else {
        this.sysUserId = sysUserId
        this.form.resetFields()
        this.visible = true
      }
    },
    handleCancel () {
      this.close()
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.selectedRole = []
    },
    handleOk () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          const params = Object.assign({'sysUserId':this.sysUserId},values)
          put(this.url, params).then((res) => {
            if (res.data === 'success') {
              that.$message.success('修改成功')
              that.close()
            } else {
              that.$message.warning(res.msg || '修改失败')
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }
      })
    },
    validateToNextPassword  (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    compareToFirstPassword  (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('passWord')) {
        callback(new Error('两次输入的密码不一样！'))
      } else {
        callback()
      }
    },
    handleConfirmBlur  (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    }

  }
}
</script>

<style scoped>

</style>
