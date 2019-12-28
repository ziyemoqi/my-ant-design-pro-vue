<template>
  <a-card :visible="visible">
    <a-form :form="form">
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构名称">
        <a-input style="border:0px;" placeholder v-decorator="['departName', {}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级部门" >
        <a-tree-select
          disabled
          style="width:100%;border: 0px;border: none;outline:none;"
          :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
          :treeData="treeData"
          v-model="model.parentId"
          placeholder="无"
        ></a-tree-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构编码">
        <a-input style="border:0px;" placeholder v-decorator="['uniqueCoding', {}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构类型">
        <a-radio-group :disabled="true" v-decorator="['orgType',{}]" placeholder="请选择机构类型">
          <a-radio value="1">公司</a-radio>
          <a-radio value="2">部门</a-radio>
          <a-radio value="3">岗位</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
        <a-input-number style="border:0px;" v-decorator="[ 'sort',{}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="办公电话">
        <a-input style="border:0px;" placeholder v-decorator="['telephone', {}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地址">
        <a-input style="border:0px;" placeholder v-decorator="['address', {}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
        <a-textarea :disabled="true" placeholder v-decorator="['remark', {}]" />
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import pick from 'lodash.pick'
import { queryIdTree } from '@/api/dept'

export default {
  name: 'DeptBaseInfo',
  components: {},
  data() {
    return {
      departTree: [],
      model: {},
      visible: false,
      disable: true,
      treeData: [],
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },
  created() {
    this.loadTreeData()
  },
  methods: {
    loadTreeData() {
      queryIdTree().then(res => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.length; i++) {
            let temp = res.data[i]
            this.treeData.push(temp)
          }
        }
      })
    },
    open(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(record, 'orgType', 'departName', 'uniqueCoding', 'sort', 'telephone', 'fax', 'address', 'remark')
        )
      })
    },
    clearForm() {
      this.form.resetFields()
      this.treeData = []
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>