<template>
<a-card :bordered="false" class="card-area">
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" :form="screenForm" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="default" icon="reload" style="margin-left: 8px" @click="refresh" :loading="loading">刷新</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="sysUserId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >

        <span slot="sex" slot-scope="text">
          <a-tag color="green" v-if="text === 0 ">女</a-tag>
          <a-tag color="blue" v-else-if="text === 1 ">男</a-tag>
          <a-tag color="yellow" v-else-if="text === 2 ">保密</a-tag>
          <a-tag color="red" v-else>未知</a-tag>
        </span>

        <span slot="online" slot-scope="text">
          <a-tag color="red" v-if="text === '0' ">离线</a-tag>
          <a-tag color="green" v-else-if="text === '1' ">在线</a-tag>
          <a-tag color="yellow" v-else-if="text === '2' ">隐身</a-tag>
          <a-tag color="red" v-else>未知</a-tag>
        </span>

         <span slot="pic" slot-scope="text">
            <img class='img' alt="" :src="imgUrl+text" />
        </span>

      <span slot="action" slot-scope="text, record">
        <a-button :disabled="userInfo().sysUserId === record.sysUserId" @click="handleChat(record)" type="primary" icon="message">聊天</a-button>&nbsp;&nbsp;
      </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- form表单 -->
    <Dialog-Chat-Message ref="dialogMessage" @ok="modalFormOk"></Dialog-Chat-Message>

  </a-card>
</template>

<script>
import Vue from 'vue'
import { chatPage } from '@/api/user'
import DialogChatMessage from './modules/dialogChatMessage'
import { mapGetters } from 'vuex'

const columns = [
  {
    title: '#',
    dataIndex: '',
    key: 'rowIndex',
    width: 60,
    align: 'center',
    customRender: function(t, r, index) {
      return parseInt(index) + 1
    }
  },
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'userName',
    width: 150
  },
  {
    title: '头像',
    align: 'center',
    dataIndex: 'headImg',
    scopedSlots: { customRender: 'pic' },
    width: 150
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'online',
    scopedSlots: { customRender: 'online' },
    width: 150
  },
  {
    title: '年龄',
    align: 'center',
    dataIndex: 'age',
    width: 80
  },
   {
    title: '生日',
    align: 'center',
    dataIndex: 'birthday',
    width: 130
  },
  {
    title: '性别',
    align: 'center',
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' },
    width: 100
  },
  {
    title: '手机',
    align: 'center',
    dataIndex: 'phone',
    width: 150
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' },
    width: 150
  }
]

export default {
  name: 'Chat_view',
   components: {
    DialogChatMessage,
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      screenForm: this.$form.createForm(this),
      columns: columns,
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      imgUrl: process.env.VUE_APP_IMG,
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
     ...mapGetters(['userInfo']),
    async loadData() {
      let that = this
      let screenData = this.screenForm.getFieldsValue()
      let obj = {
        current: that.ipagination.current,
        size: that.ipagination.pageSize,
        ...screenData
      }
      this.loading = true
      await chatPage(obj).then(res => {
        if (res.code === 200) {
          this.dataSource = res.data
          that.ipagination.total = res.page.total
        }
        this.loading = false
      })
    },
    refresh() {
      this.loading = true
      this.loadData()
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData()
    },
     // 聊天
    handleChat: function(record) {
      this.$refs.dialogMessage.init(record)
      this.$refs.dialogMessage.title = '聊天'
      this.$refs.dialogMessage.disableSubmit = false
    },
    // 新增/修改 成功时，重载列表
    modalFormOk() {
      this.loadData()
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.img {
    flex: none;
    width: 60px;
    height: 60px;
  }
</style>