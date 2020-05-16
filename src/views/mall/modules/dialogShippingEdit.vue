<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top:10%;height: 70%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收货人">
          <a-input placeholder="请输入..." v-decorator="['receiverName', {
            rules: [{required: true, message: '请填写名称'}]
          }]" />
        </a-form-item>

        <a-form-item label="收货电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['receiverPhone',validatorRules.phone]" placeholder="请输入..." />
        </a-form-item>
        
        <a-form-item label="收货地址" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-cascader
            :options="areaOptions"
            placeholder="请选择..."
            v-decorator="['regionInfo', { rules: [{ required: true, message: '请选择收货地址' }]}]"/>
        </a-form-item>

       <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="详细地址">
          <a-input placeholder="请输入..." v-decorator="['receiverAddress', {
            rules: [{required: true, message: '请填写地址'}]
          }]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import {add,editById} from '@/api/mall/shipping'
import * as region from '@/api/region';

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
        areaOptions: [],
        validatorRules: {
          phone: { rules: [{ required: true, validator: this.validatePhone }] },
        },
      }
    },
    mounted() {
      this.area();
    },
    methods: {
      // 获取行政区域
      async area() {
        let { code, data } = await region.regionList();
        if (code === 200) {
          this.areaOptions = this.handleAreaTreeData(data);
        } else {
          this.$message.warn('未获取到相关行政区域数据！');
        }
      },
      // 处理行政区域数据
      handleAreaTreeData(tree) {
        for (let node of tree) {
          node.label = node.title
          node.value = node.key
          node.scopedSlots = {
            icon: 'icon',
            title: 'title'
          }
          if (node.children) node.children = this.handleAreaTreeData(node.children)
        }
        return tree
      },
      //  验证手机号
      validatePhone(rule, value, callback) {
        if (!value || new RegExp(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/).test(value)) {
          callback();
        } else {
          // eslint-disable-next-line standard/no-callback-literal
          callback('请输入正确格式的手机号码!');
        }
      },
      add () {
        this.edit({});
      },
      edit (record) {
        let that = this
        this.confirmLoading = false
        this.form.resetFields()
        this.visible = true
        if(record.mallShippingId) {
          let regionInfo= [record.receiverProvinceCode,record.receiverCityCode,record.receiverAreaCode]
          let obj = {
            ...record,
            regionInfo
          }
          that.$nextTick(() => {
          that.form.setFieldsValue(pick(obj,'receiverName','receiverPhone','receiverAddress','regionInfo'))
        });
        }
      },
      close () {
        this.fileList = []
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
            let regionInfo = {
              receiverProvince: values.regionInfo[0],
              receiverCity: values.regionInfo[1],
              receiverArea: values.regionInfo[2],
              regionCode: values.regionInfo[2]
            };
            let formData = Object.assign(this.model, values,{...regionInfo})
            let obj
            if(!this.model.mallShippingId){
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