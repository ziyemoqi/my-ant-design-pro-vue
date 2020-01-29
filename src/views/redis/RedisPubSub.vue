<template>
  <a-card :bordered="false" class="card-area">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-row :gutter="24">
        <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
          <a-col :md="6" :sm="24">
            <a-button @click="add" type="primary" icon="plus" style="margin-left:10px">发布</a-button>
            <a-button
              @click="refresh"
              type="default"
              icon="reload"
              style="margin-left: 8px"
              :loading="loading"
            >刷新</a-button>
          </a-col>
        </span>
      </a-row>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="redisPubSubId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import Vue from 'vue'
import { pubSubPage, sendMessage } from '@/api/redis'

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
    title: '通道',
    align: 'center',
    dataIndex: 'channel',
    width: 120
  },
  {
    title: '内容',
    align: 'center',
    dataIndex: 'content',
    width: 200
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    width: 120
  }
]

export default {
  name: 'RedisPubSub_view',

  data() {
    return {
      dataSource: [],
      loading: false,
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
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      let that = this
      let obj = {
        current: that.ipagination.current,
        size: that.ipagination.pageSize
      }
      this.loading = true
      await pubSubPage(obj).then(res => {
        if (res.code === 200) {
          this.dataSource = res.data
          that.ipagination.total = res.page.total
        }
        this.loading = false
      })
    },
    // 发布
    add: function() {
        let that = this
         that.loading = true
      sendMessage
        .then(res => {
          if (res.code === 200) {
            that.$message.success('发布成功!')
            that.loadData()
          } else {
            that.$message.warning(res.msg || '发布失败!')
          }
        })
        .finally(() => {
          that.loading = false
        })
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    // 刷新
    refresh() {
      this.loading = true
      this.loadData()
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>