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
          label="名称">
          <a-input placeholder="请输入..." v-decorator="['name', {
            rules: [{required: true, message: '请填写名称'}]
          }]" />
        </a-form-item>

        <a-form-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="1" v-decorator="['age', { rules: [{required: true, message: '请输入年龄'}] }]" style="width:100%"  placeholder="请输入..." />
        </a-form-item>

       <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="地址">
          <a-input placeholder="请输入..." v-decorator="['address', {
            rules: [{required: true, message: '请填写地址'}]
          }]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="文件">
            <a-upload
              name="file"
              :multiple="true"
              :action="appApi"
              :headers="headers"
              :fileList="fileList"
              @change="handleChange"
            >
              <a-button> <a-icon type="upload" />上传文件</a-button>
            </a-upload>
        </a-form-item>

        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="0" v-decorator="['sort',{ rules: [{required: true, message: '请输入排序号'}]}]" style="width:100%"  placeholder="请输入..." />
        </a-form-item>

        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
              v-decorator="['remark']"
              placeholder="请输入..."
              :rows="4" 
            />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {editById,add} from '@/api/demo'

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
        uploading: false,
        headers: {
          authorization: 'authorization-text',
        },
        appApi: process.env.VUE_APP_API + '/upload/file/',
        documentName: '',
        documentUrl: '',
        fileList: []
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
        if(record.documentUrl) {
          this.fileList = [{
              uid: record.demoId,
              name: record.documentName,
              status: 'done',
              url: process.env.VUE_APP_FILE + record.documentUrl
            }];
          this.documentName = record.documentUrl
          this.documentUrl = record.documentUrl
        }
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'name','age','address','sort','remark'))
        });
      },
      close () {
        this.fileList = []
        this.$emit('close')
        this.visible = false
      },
      // 文件上传
      handleChange(info) {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-2);
        fileList = fileList.map(file => {
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });
        this.fileList = fileList;
        if (info.file.status === 'done') {
          this.documentUrl = info.file.response.data
          this.documentName = info.file.name
        } else if(info.file.status === 'removed'){
          this.documentUrl = ''
          this.documentName = ''
        } else if (info.file.status === 'error') {
          this.$message.error(`文件上传失败`);
        }
      },
      // 提交操作
      handleOk () {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values,{'documentUrl':this.documentUrl,'documentName':this.documentName})
            let obj
            if(!this.model.demoId){
              obj=add(formData)
            }else{
              obj=editById(formData)
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