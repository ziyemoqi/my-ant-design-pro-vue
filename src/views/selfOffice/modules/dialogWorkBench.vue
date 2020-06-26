<template>
  <a-modal
    :title="title"
    :width="700"
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
          label="标题">
          <a-input placeholder="请输入..." v-decorator="[ 'title', { rules: [{required: true, message: '请输入标题'}]}]" />
        </a-form-item>

        <a-form-item label="功能描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
           <a-textarea
              v-decorator="['content',{ rules: [{required: true, message: '请填写功能描述'}]}]"
              placeholder="请输入..."
              :rows="9" 
            />
        </a-form-item>

         <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number :min="0" v-decorator="['sort',{ rules: [{required: true, message: '请输入排序号'}]}]" style="width:100%"  placeholder="请输入..." />
          </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import {save} from '@/api/selfOffice/workBench'

  export default {
    name: "dialogWorkBench",
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
          this.form.setFieldsValue(pick(this.model,'title','content','sort'))
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
            let obj= save(formData).then((res)=>{
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