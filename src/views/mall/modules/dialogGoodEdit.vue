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
    style="top:5%;height: 100%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        
         <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="审核结果" v-if="checkFlag">
          <a-radio-group buttonStyle="solid" v-decorator="[ 'state', {'initialValue':1}]">
            <a-radio-button :value="1">审核通过</a-radio-button>
            <a-radio-button :value="2">审核拒绝</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品名称">
          <a-input placeholder="请输入..." v-decorator="[ 'name', validatorRules.name]" />
        </a-form-item>

        <a-form-item label="价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="1" :precision="2" v-decorator="['price', { rules: [{required: true, message: '请输入价格'}] }]" style="width:100%"  placeholder="请输入..." />
        </a-form-item>

        <a-form-item label="商品图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            name="file"
            listType="picture-card"
            :showUploadList="false"
            :action="appApi"
            :beforeUpload="validImg"
            @change="handleChangeBaseImg"
          >
            <img v-if="imgUrl" :src="imgUrl" alt="商品图片" style="width: 100px;height: 100px" />
            <div v-else>
              <a-icon :type="uploading ? 'loading' : 'plus'" />
            </div>
          </a-upload>
        </a-form-item>

         <a-form-item label="所属类目" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-cascader
            :options="goodClassOptions"
            placeholder="请选择..."
            v-decorator="['classArr', { rules: [{ required: true, message: '请选择商品类目' }]}]"/>
        </a-form-item>


        <a-form-item label="库存" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="1" v-decorator="['stock', { rules: [{required: true, message: '请输入库存'}] }]" style="width:100%"  placeholder="请输入..." />
        </a-form-item>

        <a-form-item label="商品描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
           <a-textarea
              v-decorator="['description']"
              placeholder="请输入..."
              :rows="2" 
            />
        </a-form-item>

         <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number :min="0" v-decorator="['sort',{ rules: [{required: true, message: '请输入排序号'}]}]" style="width:100%"  placeholder="请输入..." />
          </a-form-item>

        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
              v-decorator="['remark']"
              placeholder="请输入..."
              :rows="2" 
            />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import {updateGood,add} from '@/api/mall/mallProduct'
import {classList} from '@/api/mall/mallProductCategory'

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
        appApi: process.env.VUE_APP_API + '/upload/img/',
        imgUrl: '',
        goodImg: '',
        uploading: false,
        validatorRules:{
          name:{
            rules: [
              { required: true, message: '请输入商品名称!' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
            ]}
        },
        checkFlag: false,
        goodClassOptions: [],
      }
    },
    mounted() {
      this.classInit();
    },
    methods: {
      // 获取商品类目
      async classInit() {
        let { code, data } = await classList();
        if (code === 200) {
          this.goodClassOptions = this.handleClassTreeData(data);
        } else {
          this.$message.warn('未获取到商品类目数据！');
        }
      },
      // 处理商品类目
      handleClassTreeData(tree) {
        for (let node of tree) {
          node.label = node.name
          node.value = node.mallProductCategoryId
          node.scopedSlots = {
            icon: 'icon',
            title: 'title'
          }
          if (node.children) node.children = this.handleClassTreeData(node.children)
        }
        return tree
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.confirmLoading = false
        this.form.resetFields()
        this.visible = true
        if(record.mallProductId){
          this.model = Object.assign({}, record)
          this.imgUrl = process.env.VUE_APP_IMG + this.model.pic
          this.goodImg = this.model.pic
          let classArr= [record.pclassId,record.classId]
          let obj = {
            ...record,
            classArr
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(obj,'name','stock','price','description','sort','remark','classArr'))
          });
        }else {
          this.imgUrl = ''
          this.goodImg = ''
        }
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
            if(values.lowStock > values.stock) {
              this.$message.warning('库存值应大于库存预警值！')
            }else {
              that.confirmLoading = true;
              let classId = values.classArr[1]
              let formData = Object.assign(this.model, values,{"pic" : this.goodImg,'classId':classId})
              let obj
              if(!this.model.mallProductId){
                obj=add(formData)
              }else{
                obj=updateGood(formData)
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
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validImg(file) {
        let size = file.size;
        let limitSize = size / 1024 / 1024;
        if (limitSize > 5) {
          this.$message.warning('请上传少于5M的图片!');
          return false;
        }
      },
      handleChangeBaseImg(info) {
        if (info.file.status === 'uploading') {
          this.uploading = true;
          return;
        }
        if (info.file.status === 'done') {
          this.imgUrl = process.env.VUE_APP_IMG + info.file.response.data;
          this.goodImg = info.file.response.data;
          this.uploading = false;
        }
      }
    }
  }
</script>