<template>
<a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    okText="发送"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;overflow-y: hidden">

  <a-list
    class="comment-list"
    :header="`${messageData.length} 条消息`"
    item-layout="horizontal"
    :data-source="messageData"
    :visible="visible"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" >
      <a-comment :author="item.author" :avatar="item.avatar">
        <p slot="content" style="height:40px;">
          {{ item.content }}
        </p>
        <a-tooltip slot="datetime" >
          <span>{{ item.datetime }}</span>
        </a-tooltip>
      </a-comment>
    </a-list-item>
  </a-list>
  <div style="margin: 20px 0px 0px 10px;">
    <a-textarea
        placeholder="现在我们可以开始聊天了"
        :rows="4"
        :auto-size="{ minRows: 4, maxRows: 10 }"
        v-model="messageContent"
      />
  </div>
  </a-modal>
</template>
<script>
import moment from 'moment';
import Vue from 'vue'
import { sendMessage,init } from '@/api/selfOffice/chat'

export default {
  data() {
    return {
      messageData: [],
      moment,
      confirmLoading: false,
      visible: false,
      model: {},
      receiveUserHeadImg: '',
      title:"聊天信息",
      messageContent: ''
    };
  },
  methods: {
     init (record) {
        this.confirmLoading = false
        this.model = Object.assign({}, record)
        this.receiveUserHeadImg = process.env.VUE_APP_IMG + this.model.headImg
        this.visible = true
        this.loadData()
      },
      loadData() {
        init({receiveUserId:this.model.sysUserId}).then(res => {
          if (res.code === 200 && res.data) {
            this.handleMessageData(res.data)
          }
        })
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
        if(!this.messageContent){
          that.$message.warning('不能发送空白信息!')
        } else {
          let obj = {
            receiveUserId: that.model.sysUserId,
            content: that.messageContent
          }
          sendMessage(obj).then(resp => {
            if (resp.code === 200) {
              let handleData =  this.handleMessageData(resp.data)
              that.messageContent = ''
            } else {
              that.$message.error(resp.msg || '发送失败!')
            }
          })
        }
      },
      // 处理聊天记录
      handleMessageData(data) {
        for (let node of data) {
          node.actions = ['撤销'],
          node.author = node.userName,
          node.avatar = process.env.VUE_APP_IMG + node.headImg
          node.datetime = node.time
        }
        this.messageData = data
      },
  }
};
</script>
