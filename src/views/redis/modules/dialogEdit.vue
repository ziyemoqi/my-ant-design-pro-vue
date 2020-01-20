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
          label="姓名">
          <a-input placeholder="请输入姓名" v-decorator="[ 'name', validatorRules.name]" />
        </a-form-item>

          <a-form-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number :min="1" v-decorator="['age']" style="width:100%"  placeholder="请输入..." />
          </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">
          <a-select v-decorator="['sex',{'initialValue':'0'}]" >
            <a-select-option value="0">女</a-select-option>
            <a-select-option value="1">男</a-select-option>
            <a-select-option value="2">保密</a-select-option>
            <a-select-option value="3">未知</a-select-option>
          </a-select>
        </a-form-item>

          <a-form-item label="住址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input :min="1" v-decorator="['address']" style="width:100%"  placeholder="请输入..." />
          </a-form-item>

         <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number :min="1" v-decorator="['sort',{'initialValue':100}]" style="width:100%"  placeholder="请输入..." />
          </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-textarea :rows="5" placeholder="请输入描述" v-decorator="[ 'remark', validatorRules.description ]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {edit,add} from '@/api/redis'

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
              { required: true, message: '请输入姓名!' },
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
          this.form.setFieldsValue(pick(this.model,'name','age','sex','remark','sort','address'))
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
            if(!this.model.redisUserId){
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