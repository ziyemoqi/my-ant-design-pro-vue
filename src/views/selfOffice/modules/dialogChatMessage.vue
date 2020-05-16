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
      messageData: [],
      moment,
      confirmLoading: false,
      visible: false,
      model: {},
      receiveUserHeadImg: '',
      title:"聊天信息",
    };
  },
  methods: {
    init (record) {
        this.confirmLoading = false
        this.model = Object.assign({}, record)
        this.receiveUserHeadImg = process.env.VUE_APP_IMG + this.model.pic
        this.visible = true
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
          receiveUserId: that.model.sysUserId,
          content: '你好啊！'
        }
        sendMessage(obj).then(resp => {
          if (resp.code === 200) {
            console.log(resp.data)
            let handleData =  this.handleMessageData(resp.data)
            
          } else {
            that.$message.error(resp.msg || '发送失败!')
          }
        })
      },
      // 处理聊天记录
      handleMessageData(data) {
        console.log("开始处理聊天信息")
        for (let node of data) {
          console.log(node)
        }
        return data
      },
  }
};
</script>
