<template >
<div>
    <div class="result">
        <div class="title">{{mallProductName}}</div>
        <div v-if="state === '0' "><i class="iconfont icon-icon_shizhong-" style="color:red;font-size:29px"> 秒杀倒计时:{{day+"天"+hr+"小时"+min+"分钟"+sec+"秒"}}</i></div>
        <div v-if="state === '1' "><i class="iconfont icon-icon_shizhong-" style="color:red;font-size:33px;"></i> &nbsp;&nbsp;&nbsp;&nbsp;<a-button type="primary" @click="execSeckill()">开始秒杀</a-button></div>
        <div v-if="state === '2' "><i class="iconfont icon-icon_shizhong-" style="color:red;font-size:25px"> 秒杀结束,感谢您的参与</i></div>
    </div>
</div>
</template>

<script>
import {linkInfo,execSeckill} from '@/api/mall/mallSeckill'
import Vue from 'vue'

export default {
  name: 'mallSeckillLink',
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
      mallSeckillId: '',
      mallProductName: '',
      nowTime: '',
      day: 0,//天
      hr: 0,//时
      min: 0,//分
      sec: 0,//秒
      state: '',
      md5Str: ''
    };
  },
  mounted(){
    this.mallSeckillId = Vue.ls.get("mallSeckillId")
    if(this.mallSeckillId) {
      this.loadData()
    }
  },
  beforeDestroy() {
    clearInterval(this._interval)
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      await linkInfo({ mallSeckillId: this.mallSeckillId }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.mallProductName = data.mallProductName
          this.nowTime = data.localDateTime
          this.state = data.state
          this.md5Str = data.md5
          // 状态(0:未开始 1:开始秒杀 2:已结束)
          if(data.state === '0'){
            this.limitTime(data)
          }else if(data.state === '1') {
            this.initSeckill()
          } else if(data.state === '2'){
            this.state = '2'
          }
        } else {
          that.$message.warning(res.msg || '操作失败!')
        }
        this.loading = false
      })
    },
    // 倒计时
    limitTime (data) {
      var end = new Date(data.seckillStartTime);
      var now = new Date(this.nowTime);
      if (now.getTime() > end.getTime()){
        this.initSeckill()
      } else {
        var msec = end - now;
        let day = parseInt(msec / 1000 / 60 / 60 / 24);
        let hr = parseInt(msec / 1000 / 60 / 60 % 24);
        let min = parseInt(msec / 1000 / 60 % 60);
        let sec = parseInt(msec / 1000 % 60);
        this.day = day
        this.hr = hr > 9 ? hr : '0' + hr;
        this.min = min > 9 ? min : '0' + min;
        this.sec = sec > 9 ? sec : '0' + sec;
        var that = this;
        // 当前时间+1s
        var t_s = now.getTime()
        var nt = new Date(this.nowTime)
        nt.setTime(t_s + 1000)
        that.nowTime = new Date(nt)
        this._interval = setTimeout(function () {
            that.limitTime(data)
        }, 1000)
      }
    },
    // 进入抢购
    initSeckill() {
      this.state = '1'
    },
    // 执行秒杀
    async execSeckill(values) {
      try {
        this.loading = true
        let obj = { 
          md5: this.md5Str,
          mallSeckillId: this.mallSeckillId
        };
        let { code, data, msg } = await execSeckill(obj)
        if (code === 200){
          this.$router.push({
            path: '/mall/seckill',
            name: 'mall-seckill'
          })
        } else {
          throw new Error(msg || '操作失败');
        }
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.loading = false;
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

    .title {
      font-size: 34px;
      color: rgba(0, 0, 0, .85);
      font-weight: 500;
      line-height: 32px;
      margin-bottom: 26px;
    }
    .content {
      background: #fafafa;
      padding: 24px 40px;
      border-radius: 2px;
      text-align: left;
      font-size: 20px;
    }
  }
</style>
