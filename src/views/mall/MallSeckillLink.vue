<template >
<div>
    <div class="result">
        <div class="title">{{mallGoodName}}</div>
        <div><i class="iconfont icon-icon_shizhong-" style="color:red;font-size:29px"></i>倒计时</div>
    </div>
</div>
</template>

<script>
import {linkInfo} from '@/api/mall/mallSeckill';

export default {
  name: 'mallPay',
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      isSuccess: true,
      mallSeckillId: '',
      mallGoodName: ''
    };
  },
  mounted(){
    this.mallSeckillId = this.$route.params.mallSeckillId
    if(this.mallSeckillId){
      this.loadData()
    }
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      await linkInfo({ mallSeckillId: this.mallSeckillId }).then(res => {
        if (res.code === 200) {
          this.mallGoodName = res.data.mallGoodName
          console.log(res.data)
        } else {
          that.$message.warning(res.msg || '操作失败!')
        }
        this.loading = false
      })
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
