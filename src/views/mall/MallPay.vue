<template >
<div>
    <div class="result">
        <div>
          <a-icon :class="[isSuccess ? 'success' : 'error' ,'icon']" :type="isSuccess ? 'check-circle' : 'close-circle'"/>
        </div>
        <div class="title">订单提交成功，去付款咯~</div>
        <div class="description">
          <p>请在<span style="color:red;">30分钟</span>内完成支付，超时后将取消订单</p>
        </div>
        <div class="content">
          <div><p>收货信息:{{shipping}}</p></div>
          <div><p>应付金额:￥{{payAmount}}</p></div>
        </div>
        <div class="action">
          <slot name="action"></slot>
        </div>
    </div>
    <div style="margin: 0px 0px 0px 250px;">
        <sub-title title="选择以下支付方式付款"/>
        <a-row :gutter="24" style="margin-top:10px">
          <a-col :span="12">
              <a-button @click="payByali()"  icon="alipay" size="large">支付宝</a-button>&nbsp;
              <a-button @click="payByWx()"  icon="wechat" size="large">微信</a-button>
          </a-col>
          
        </a-row>
        </div>
</div>
</template>

<script>
import * as good from '@/api/mall/mallGood'
import * as order from '@/api/mall/mallOrder'
import {shipingList} from '@/api/mall/shipping'
import * as region from '@/api/region';
import SubTitle from '@/components/basis/SubTItle'

export default {
  name: 'mallPay',
  components: {
    SubTitle
  },
  data() {
    let form = this.$form.createForm(this);
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      submitting: false,
      form,
      goodScreenForm: this.$form.createForm(this),
      isSuccess: true,
      payAmount: '',
      shipping: '',
      orderNo:'',
      sysUserId:'',
    };
  },
  mounted(){
    this.payAmount = '0.01'
    this.shipping = this.$route.params.shipping
    this.sysUserId = this.$route.params.sysUserId
    this.orderNo = this.$route.params.orderNo
  },
  methods: {
    // 支付宝支付
    payByali(){
      //  "_blank"  新打开一个窗口
      //  "_self"    覆盖当前的窗口
      window.open('http://localhost:8080/aliPay/createForAliNative?orderNo='+this.orderNo+'&amount='+this.payAmount+'&sysUserId='+this.sysUserId,"_self")
    },
    //  微信支付
    payByWx(){
      window.open('http://localhost:8080/wxPay/createForWxNative?orderNo='+this.orderNo+'&amount='+this.payAmount+'&sysUserId='+this.sysUserId,"_self")
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) return
          this.createOrder({...values})
      });
    },
    async createOrder(values) {
      try {
        this.submitting = true
        let goodsInfo = this.tableData
        let obj = { ...values,goodsInfo }
        let { code, data, msg } = await order.createOrder(obj)
        if (code !== 200) throw new Error(msg || '操作失败')
        this.$message.success('操作成功')
        this.$emit('update:visible', false)
        this.$emit('submitted')
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.submitting = false;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
 .result {
    text-align: center;
    width: 72%;
    margin: 0 auto;
    padding: 24px 0 8px;

    .icon {
      font-size: 72px;
      line-height: 72px;
      margin-bottom: 24px;
    }
    .success {
      color: #52c41a;
    }
    .error {
      color: red;
    }
    .title {
      font-size: 24px;
      color: rgba(0, 0, 0, .85);
      font-weight: 500;
      line-height: 32px;
      margin-bottom: 16px;
    }
    .description {
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.45);
      margin-bottom: 24px;
    }
    .content {
      background: #fafafa;
      padding: 24px 40px;
      border-radius: 2px;
      text-align: left;
      font-size: 20px;
    }
    .action {
      margin-top: 32px;
    }
  }

  .mobile {
    .result {
      width: 100%;
      margin: 0 auto;
      padding: unset;
    }
  }
</style>
