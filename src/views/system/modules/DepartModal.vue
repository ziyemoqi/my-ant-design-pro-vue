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
          label="机构名称"
          :hidden="false"
          hasFeedback
        >
          <a-input
            id="departName"
            placeholder="请输入机构/部门名称"
            v-decorator="['departName', validatorRules.departName ]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级部门" hasFeedback>
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData="departTree"
            v-model="model.parentId"
            placeholder="请选择上级部门"
            :disabled="condition"
          ></a-tree-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构类型">
          <template>
            <a-radio-group v-decorator="['orgType',{'initialValue':'2'}]" placeholder="请选择机构类型">
              <a-radio value="1">公司</a-radio>
              <a-radio value="2">部门</a-radio>
              <a-radio value="3">岗位</a-radio>
            </a-radio-group>
          </template>
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
import { queryIdTree, addDept } from '@/api/dept'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  name: 'DepartModal',
  components: { ATextarea },
  data() {
    return {
      departTree: [],
      orgTypeData: [],
      phoneWarning: '',
      departName: '',
      title: '操作',
      visible: false,
      condition: true,
      disableSubmit: false,
      model: {},
      menuhidden: false,
      menuusing: true,
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
      url: {
        add: '/sys/sysDepart/add'
      },
      dictDisabled: true
    }
  },
  created() {},
  methods: {
    loadTreeData() {
      var that = this
      queryIdTree().then(res => {
        if (res.code === 200) {
          that.departTree = []
          for (let i = 0; i < res.data.length; i++) {
            let temp = res.data[i]
            that.departTree.push(temp)
          }
        }
      })
    },
    // 添加前调用
    add(depart) {
      if (depart) {
        this.dictDisabled = false
      } else {
        this.dictDisabled = true
      }
      this.edit(depart)
    },
    // 修改前调用
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, {})
      this.visible = true
      this.loadTreeData()
      this.model.parentId = record != null ? record.toString() : null
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'orgType',
            'departName',
            'sort',
            'orgCode',
            'telephone',
            'fax',
            'address',
            'remark',
            'status'
          )
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