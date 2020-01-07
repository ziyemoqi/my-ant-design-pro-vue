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
          label="部门名称"
          :hidden="false"
          hasFeedback
        >
          <a-input
            id="departName"
            placeholder="请输入部门名称"
            v-decorator="['departName', validatorRules.departName ]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上级部门"
          hasFeedback
          v-if="dictDisabled"
        >
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData="departTree"
            v-model="model.parentId"
            :disabled="true"
          ></a-tree-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="办公电话">
          <a-input placeholder="请输入办公电话" v-decorator="['telephone',validatorRules.mobile]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="传真">
          <a-input placeholder="请输入传真" v-decorator="['fax', {}]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地址">
          <a-input placeholder="请输入地址" v-decorator="['address', {}]" />
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
import { departTree, addDept, editByDeptId } from '@/api/dept'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  name: 'DepartModal',
  components: { ATextarea },
  data() {
    return {
      departTree: [],
      departName: '',
      title: '操作',
      addFlag: false,
      sysDeptId: '',
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
        departName: { rules: [{ required: true, message: '请输入机构/部门名称!' }] },
        orgCode: { rules: [{ required: true, message: '请输入机构编码!' }] },
        mobile: { rules: [{ validator: this.validateMobile }] }
      },
      dictDisabled: true
    }
  },
  created() {},
  methods: {
    loadTreeData() {
      var that = this
      departTree().then(res => {
        if (res.code === 200) {
          that.departTree = []
          let handleTreeData = this.handleDeptTreeData(res.data)
          for (let i = 0; i < handleTreeData.length; i++) {
            let temp = handleTreeData[i]
            that.departTree.push(temp)
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
      this.sysDeptId = record != null ? record.sysDeptId.toString() : null
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(record, 'departName', 'sort', 'orgCode', 'telephone', 'fax', 'address', 'state', 'remark')
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
            addDept(formData)
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
            let sysDeptId = that.sysDeptId
            let editData = {
              ...formData,
              sysDeptId
            }
            editByDeptId(editData)
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