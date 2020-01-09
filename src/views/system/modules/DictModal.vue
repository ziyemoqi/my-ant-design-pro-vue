<template>
  <a-modal
    :title="title"
    :width="800"
    :ok="false"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="字典名称"
          :hidden="false"
          hasFeedback
        >
          <a-input
            id="name"
            placeholder="请输入字典名称"
            v-decorator="['name', validatorRules.keyWork ]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="字典值">
          <a-input placeholder="请输入字典值" v-decorator="['value',validatorRules.value]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上级字典"
          hasFeedback
          v-if="dictDisabled"
        >
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData="dictTree"
            v-model="model.parentId"
            :disabled="true"
          ></a-tree-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
          <a-radio-group buttonStyle="solid" v-decorator="[ 'state', {'initialValue':0}]">
            <a-radio-button :value="0">正常</a-radio-button>
            <a-radio-button :value="1">停用</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number v-decorator="[ 'sort',{'initialValue':100}]" style="width:100%" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
          <a-textarea placeholder="请输入备注" v-decorator="['remark', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {dictTree, add, edit} from '@/api/dict'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'


import { departTree, addDept, editByDeptId } from '@/api/dept'
export default {
  name: 'DictModal',
  components: { ATextarea },
  data() {
    return {
      dictTree: [],
      departName: '',
      title: '操作',
      addFlag: false,
      sysDictId: '',
      visible: false,
      condition: true,
      disableSubmit: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        keyWork: { rules: [{ required: true, message: '请输入字典名称!' }] },
        value: { rules: [{ required: true, message: '请输入字典值!' }] },
      },
      dictDisabled: true
    }
  },
  created() {},
  methods: {
    loadTreeData() {
      var that = this
      dictTree().then(res => {
        if (res.code === 200) {
          that.dictTree = []
          let handleTreeData = this.handleDictTreeData(res.data)
          for (let i = 0; i < handleTreeData.length; i++) {
            let temp = handleTreeData[i]
            that.dictTree.push(temp)
          }
        }
      })
    },
    handleDictTreeData(tree) {
      for (let node of tree) {
        node.key = node.title
        node.value = node.id
        if (node.children) node.children = this.handleDictTreeData(node.children)
      }
      return tree
    },
    // 添加前调用
    add(dict) {
      if (dict) {
        this.dictDisabled = true
      } else {
        this.dictDisabled = false
      }
      this.form.resetFields()
      this.model.parentId = dict
      this.visible = true
      this.loadTreeData()
    },
    // 修改前调用
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, {})
      this.visible = true
      this.loadTreeData()
      this.model.parentId = record != null ? record.parentId.toString() : null
      this.sysDictId = record != null ? record.sysDictId.toString() : null
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(record, 'name', 'sort', 'value', 'state', 'remark')
        )
      })
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
    },
    // 提交
    handleOk() {
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          if (that.addFlag) {
            add(formData)
              .then(res => {
                if (res.code === 200) {
                  that.$message.success('操作成功!')
                  that.loadTreeData()
                  that.$emit('ok')
                } else {
                  that.$message.warning(res.msg || '操作失败!')
                }
              })
              .finally(() => {
                that.confirmLoading = false
                that.close()
              })
          } else {
            let sysDictId = that.sysDictId
            let editData = {
              ...formData,
              sysDictId
            }
            edit(editData)
              .then(res => {
                if (res.code === 200) {
                  that.$message.success('操作成功!')
                  that.loadTreeData()
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
        }
      })
    },
    handleCancel() {
      this.close()
    },
    // 验证电话
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    }
  }
}
</script>

<style scoped>
</style>