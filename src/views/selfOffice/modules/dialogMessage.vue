<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :okButtonProps="{ props: {disabled: disabled} }"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row style="width: 100%;">
          <a-col :span="24/2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标题">
              <a-input
                placeholder="请输入标题"
                v-decorator="['title', validatorRules.title]"
                :readOnly="disableSubmit"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24/2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="消息类型">
              <a-select
                v-decorator="[ 'type', validatorRules.msgCategory]"
                placeholder="请选择消息类型"
                :disabled="disableSubmit"
                :getPopupContainer="(target) => target.parentNode"
              >
                <a-select-option value="0">通知公告</a-select-option>
                <a-select-option value="1">系统消息</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%;">
          <a-col :span="24/2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="优先级">
              <a-select
                v-decorator="[ 'level', {}]"
                placeholder="请选择优先级"
                :disabled="disableSubmit"
                :getPopupContainer="(target) => target.parentNode"
              >
                <a-select-option value="0">低</a-select-option>
                <a-select-option value="1">中</a-select-option>
                <a-select-option value="2">高</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <a-row>
          <a-col :span="24/2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="文件">
              <a-upload
                name="file"
                :multiple="true"
                :action="appApi"
                :headers="headers"
                :fileList="fileList"
                @change="handleChange"
              >
                <a-button>
                  <a-icon type="upload" />上传文件
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row> -->
        <a-row style="width: 100%;">
          <a-col :span="24">
            <a-form-item :labelCol="labelColX1" :wrapperCol="wrapperColX1" label="内容">
              <d-editor v-decorator="[ 'content', {} ]" triggerChange></d-editor>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import DEditor from '@/components/editor/DEditor'
import { sendAll } from '@/api/selfOffice/message'

export default {
  components: { DEditor },
  name: 'dialogMessage',
  data() {
    return {
      title: '操作',
      visible: false,
      disableSubmit: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      labelColX1: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperColX1: {
        xs: { span: 24 },
        sm: { span: 21 },
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        title: { rules: [{ required: true, message: '请输入标题!' }] },
        msgCategory: { rules: [{ required: true, message: '请选择消息类型!' }] },
        endTime: { rules: [{ validator: this.endTimeValidate }] },
        startTime: { rules: [{ validator: this.startTimeValidate }] },
      },
      disabled: false,
      headers: {
        authorization: 'authorization-text',
      },
      appApi: process.env.VUE_APP_API + '/upload/file/',
      documentName: '',
      documentUrl: '',
      fileList: [],
    }
  },
  created() {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = {}
      this.disable = false
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.selectedUser = []
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          let obj
          sendAll(formData)
            .then((res) => {
              if (res.code === 200) {
                that.$message.success('操作成功!')
                that.$emit('ok')
              } else {
                that.$message.warning(res.msg || '操作失败!')
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.$emit('close')
    },
    // 文件上传
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-2)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url
        }
        return file
      })
      this.fileList = fileList
      if (info.file.status === 'done') {
        this.documentUrl = info.file.response.data
        this.documentName = info.file.name
        console.log(this.documentName)
        console.log(this.documentUrl)
      } else if (info.file.status === 'removed') {
        this.documentUrl = ''
        this.documentName = ''
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败`)
      }
    },
  },
}
</script>

<style scoped>
</style>