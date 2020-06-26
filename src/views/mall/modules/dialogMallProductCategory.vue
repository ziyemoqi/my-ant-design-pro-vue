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
          label="类目名称"
          :hidden="false"
          hasFeedback
        >
          <a-input
            id="name"
            placeholder="请输入类目名称"
            v-decorator="['name', validatorRules.name ]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上级类目"
          hasFeedback
          v-if="dictDisabled"
        >
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData="classTree"
            v-model="model.parentId"
            :disabled="true"
          ></a-tree-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number v-decorator="[ 'sort',{'initialValue':100}]" style="width:100%" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { classTree, save } from '@/api/mall/mallProductCategory'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  name: 'ClassModal',
  components: { ATextarea },
  data() {
    return {
      classTree: [],
      name: '',
      title: '操作',
      addFlag: false,
      mallProductCategoryId: '',
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
        name: { rules: [{ required: true, message: '请输入机构/类目名称!' }] }
      },
      dictDisabled: true
    }
  },
  methods: {
    loadTreeData() {
      var that = this
      classTree().then(res => {
        if (res.code === 200) {
          that.classTree = []
          let handleTreeData = this.handleDeptTreeData(res.data)
          for (let i = 0; i < handleTreeData.length; i++) {
            let temp = handleTreeData[i]
            that.classTree.push(temp)
          }
        }
      })
    },
    handleDeptTreeData(tree) {
      for (let node of tree) {
        node.key = node.title
        node.value = node.id
        if (node.children) node.children = this.handleDeptTreeData(node.children)
      }
      return tree
    },
    // 添加前调用
    add(depart) {
      if (depart) {
        this.dictDisabled = true
      } else {
        this.dictDisabled = false
      }
      this.form.resetFields()
      this.model.parentId = depart
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
      this.mallProductCategoryId = record != null ? record.mallProductCategoryId.toString() : null
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(record, 'name', 'sort')
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
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          if (that.addFlag) {
            save(formData)
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
            let mallProductCategoryId = that.mallProductCategoryId
            let editData = {
              ...formData,
              mallProductCategoryId
            }
            save(editData)
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