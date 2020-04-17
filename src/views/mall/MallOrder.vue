<template>
  <a-card :bordered="false" class="card-area">
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" :form="screenForm" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="订单号" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="请输入..." v-decorator="['orderNo']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="12">
            <a-form-item label="申请时间">
                <a-range-picker
                  v-decorator="['dateRange']"
                  :showTime="{
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]
              }" format="YYYY-MM-DD HH:mm:ss" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-button type="primary" icon="search" @click="searchQuery" style="margin-left:10px">查询</a-button>
              <a-button style="margin-left: 8px" type="primary" icon="reload" @click="searchReset" >重置</a-button>
              <a-button type="default" icon="reload" style="margin-left: 8px" :loading="loading" @click="refresh">刷新</a-button>
            </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="mallOrderId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >

        <span slot="payType" slot-scope="text">
          <a-tag color="green" v-if="text === 0 ">支付宝</a-tag>
          <a-tag color="blue" v-else-if="text === 1 ">微信</a-tag>
          <a-tag color="red" v-else>未知</a-tag>
        </span>

        <span slot="orderType" slot-scope="text">
          <a-badge :status="text | stateTypeFilter" :text="text | stateFilter" />
        </span>

        <span slot="confirmState" slot-scope="text">
          <a-badge :status="text | confirmStateTypeFilter" :text="text | confirmStateFilter" />
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import Vue from 'vue'
import { page } from '@/api/mall/mallOrder'
import moment from 'moment'

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
    title: '订单编号',
    align: 'center',
    dataIndex: 'orderNo',
    width:100
  },
  {
    title: '收货人',
    align: 'center',
    dataIndex: 'receiverName',
    width: 90
  },
  {
    title: '收货人电话',
    align: 'center',
    dataIndex: 'receiverPhone',
    width: 100
  },
  {
    title: '订单总金额',
    align: 'center',
    dataIndex: 'totalAmount',
    width: 80
  },
  {
    title: '支付金额',
    align: 'center',
    dataIndex: 'payAmount',
    width: 80
  },
  {
    title: '支付方式',
    dataIndex: 'payType',
    scopedSlots: { customRender: 'payType' },
    align: 'center',
    width: 80
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
    scopedSlots: { customRender: 'orderType' },
    align: 'center',
    width: 80
  },
  {
    title: '支付时间',
    align: 'center',
    dataIndex: 'payTime',
    width: 100
  },{
    title: '确认收货状态',
    align: 'center',
    dataIndex: 'confirmState',
    scopedSlots: { customRender: 'confirmState' },
    width: 100
  }
]

const stateMap = {
  '0': {
    state: 'success',
    text: '正常订单'
  },
  '1': {
    state: 'warning',
    text: '秒杀订单'
  }
}

const confirmStateMap = {
  '0': {
    state: 'default',
    text: '未确认'
  },
  '1': {
    state: 'success',
    text: '已确认'
  }
}

export default {
  name: 'mallGoodList_view',

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
      moment,
    }
  },

  filters: {
    stateFilter(type) {
      return stateMap[type].text
    },
    stateTypeFilter(type) {
      return stateMap[type].state
    },
    confirmStateFilter(type) {
      return confirmStateMap[type].text
    },
    confirmStateTypeFilter(type) {
      return confirmStateMap[type].state
    }
  },

  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      let that = this
      let screenForm = []
      let screenData = this.screenForm.getFieldsValue()
      if (screenData.dateRange) {
        screenForm['payStartTime'] = screenData.dateRange[0].format('YYYY-MM-DD')
        screenForm['payEndTime'] = screenData.dateRange[1].format('YYYY-MM-DD')
      }
      if(screenData.orderNo) {
        screenForm['orderNo'] = screenData.orderNo
      }
      let obj = {
        current: that.ipagination.current,
        size: that.ipagination.pageSize,
        ...screenForm
      }
      this.loading = true
      await page(obj).then(res => {
        if (res.code === 200) {
          this.dataSource = res.data
          that.ipagination.total = res.page.total
        }
        this.loading = false
      })
    },
    // 表单查询
    searchQuery(e) {
      e.preventDefault()
      this.ipagination.current = 1
      this.loadData()
    },
    // 表单重置
    searchReset() {
      this.screenForm.resetFields()
      this.ipagination.current = 1
      this.loadData()
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