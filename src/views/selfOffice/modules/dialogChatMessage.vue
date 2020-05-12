<template>
<a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 95%;overflow-y: hidden">

    
  <a-list
    class="comment-list"
    :header="`${data.length} replies`"
    item-layout="horizontal"
    :data-source="data"
    :visible="visible"
  >
    <a-list-item slot="renderItem" slot-scope="item, index">
      <a-comment :author="item.author" :avatar="item.avatar">
        <template slot="actions">
          <span v-for="action in item.actions">{{ action }}</span>
        </template>
        <p slot="content">
          {{ item.content }}
        </p>
        <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
          <span>{{ item.datetime.fromNow() }}</span>
        </a-tooltip>
      </a-comment>
    </a-list-item>
  </a-list>
  </a-modal>
</template>
<script>
import moment from 'moment';
import Vue from 'vue'
import { sendMessage } from '@/api/selfOffice/chat'


export default {
  data() {
    return {
      data: [
        {
          actions: ['撤销'],
          author: 'Han Solo',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
          datetime: moment().subtract(1, 'days'),
        },
        {
          actions: ['撤销'],
          author: 'Han Solo',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
          datetime: moment().subtract(2, 'hour'),
        },
      ],
      moment,
      confirmLoading: false,
      visible: false,
      model: {},
      title:"聊天信息",
    };
  },
  methods: {
    init (record) {
        this.confirmLoading = false
        this.model = Object.assign({}, record)
        // this.imgUrl = process.env.VUE_APP_IMG + this.model.pic
        // this.goodImg = this.model.pic
        this.visible = true
        // this.$nextTick(() => {
        //   this.form.setFieldsValue(pick(this.model,'name','stock','price','lowStock','description','sort','remark'))
        // });
      },
      close () {
        this.$emit('close')
        this.visible = false
      },
      handleCancel () {
        this.close()
      },
      // 提交操作
      handleOk () {
        const that = this
        let obj = {
          receiveUserId: '123123',
          content: '1'
        }
        sendMessage(obj).then(resp => {
          if (resp.code === 200) {
            console.log(resp)
          } else {
            that.$message.error(resp.msg || '发送失败!')
          }
        })
        // 触发表单验证
        // this.form.validateFields((err, values) => {
        //   if (!err) {
        //     if(values.lowStock > values.stock) {
        //       this.$message.warning('库存值应大于库存预警值！')
        //     }else {
        //       that.confirmLoading = true;
        //       let formData = Object.assign(this.model, values,{"pic" : this.goodImg})
        //       let obj
        //       if(!this.model.mallGoodId){
        //         obj=add(formData)
        //       }else{
        //         obj=updateGood(formData)
        //       }
        //       obj.then((res)=>{
        //         if(res.code === 200){
        //           that.$message.success('操作成功!');
        //           that.$emit('ok');
        //         }else{
        //           that.$message.warning(res.msg ||'操作失败!');
        //         }
        //       }).finally(() => {
        //         that.confirmLoading = false;
        //         that.close();
        //       })
        //     }
        //   }
        // })
      },
  }
};
</script>
