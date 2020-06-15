<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="登录账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'loginName']" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item label="用户名字" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'userName']" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="访问时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="[ 'createTime', {}]" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item label="访问IP" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'ipAddress']" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item label="操作类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'opType']" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item label="日志类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'logType']" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item label="日志内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'logContent']" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item label="请求路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'requestUrl']" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item label="请求方法" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'requestMethod']" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item label="请求类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['requestType']" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item label="请求参数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['requestParam']" :autosize="{ minRows: 2, maxRows: 10 }" :disabled="disabledFlag"/>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
          <a-textarea v-decorator="['remark']" :autosize="{ minRows: 2, maxRows: 6 }" :disabled="disabledFlag"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-drawer>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'
export default {
  name: 'LogModal',
  data() {
    return {
      modalWidth: 1800,
      drawerWidth: 700,
      title: '操作',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      disabledFlag: true
    }
  },
  methods: {
    detail(record) {
      this.resetScreenSize()
      let that = this
      that.form.resetFields()
      that.visible = true
      that.model = Object.assign({}, record)
      that.$nextTick(() => {
        that.form.setFieldsValue(pick(this.model, 'loginName', 'userName', 'ipAddress', 'opType', 'logType', 'logContent', 'requestMethod','requestUrl','requestParam','requestType', 'remark'))
        //时间格式化
        that.form.setFieldsValue({createTime: this.model.createTime ? moment(this.model.createTime) : null})
      })
    },

    close() {
      this.$emit('close')
      this.visible = false
    },
    moment,
    handleCancel() {
      this.close()
    },

    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    }
  }
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>