<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 95%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="品牌名称">
          <a-input placeholder="请输入..." v-decorator="[ 'name', validatorRules.name]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="首字母">
          <a-input placeholder="请输入..." v-decorator="[ 'firstLetter']" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="品牌制造商">
          <a-radio-group buttonStyle="solid" v-decorator="[ 'factoryStatus', {'initialValue':1}]">
            <a-radio-button :value="1">是</a-radio-button>
            <a-radio-button :value="0">否</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否显示">
          <a-radio-group buttonStyle="solid" v-decorator="[ 'showStatus', {'initialValue':1}]">
            <a-radio-button :value="1">是</a-radio-button>
            <a-radio-button :value="0">否</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="产品数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="1" v-decorator="['productCount']" style="width:100%"  placeholder="请输入..." />
        </a-form-item>

         <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number :min="1" v-decorator="['sort',{'initialValue':100}]" style="width:100%"  placeholder="请输入..." />
          </a-form-item>

        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" label="品牌故事">
          <a-textarea :rows="5" placeholder="请输入..." v-decorator="[ 'brandStory']" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {edit,add} from '@/api/mall/mallBrand'

  export default {
    name: "dialogEdit",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          name:{
            rules: [
              { required: true, message: '请输入品牌名称!' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
            ]}
        },
      }
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.confirmLoading = false
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'name','firstLetter','factoryStatus','showStatus','productCount','sort','brandStory'))
        });
      },
      close () {
        this.$emit('close')
        this.visible = false
      },
      // 提交操作
      handleOk () {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values)
            let obj
            if(!this.model.mallBrandId){
              obj=add(formData)
            }else{
              obj=edit(formData)
            }
            obj.then((res)=>{
              if(res.code === 200){
                that.$message.success('操作成功!');
                that.$emit('ok');
              }else{
                that.$message.warning(res.msg ||'操作失败!');
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel () {
        this.close()
      },
    }
  }
</script>