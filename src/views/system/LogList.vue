<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <!-- FORM搜索区域 -->
      <a-form layout="inline" :form="screenForm" @submit.prevent="handleScreenSubmit">
        <a-row :gutter="10">
          <a-col :md="6" :sm="12">
            <a-form-item label="用户名称" style="margin-left:8px">
              <a-input placeholder="请输入..." v-decorator="['userName',{}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <a-form-item label="登录账号" style="margin-left:8px">
              <a-input placeholder="请输入..." v-decorator="['loginName',{}]"></a-input>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" icon="search" style="margin-left: 18px" html-type="submit">查询</a-button>
              <a-button
                type="primary"
                icon="reload"
                style="margin-left: 8px"
                @click="handleReset"
              >重置</a-button>
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
        rowKey="sysLogId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >

      <span slot="opType" slot-scope="text">
          <a-badge :status="text | stateTypeFilter" :text="text | stateFilter" />
        </span>

        <span slot="logType" slot-scope="text">
          <a-tag color="green" v-if="text === 0 ">操作日志</a-tag>
          <a-tag color="blue" v-if="text === 1 ">登录日志</a-tag>
          <a-tag color="yellow" v-if="text === 2 ">定时任务</a-tag>
        </span>

        <span slot="state" slot-scope="text">
          <a-badge :status="text | stateTypeFilter" :text="text | stateFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <Log-modal ref="modalForm" ></Log-modal>
  </a-card>
</template>

<script>
import { logPage } from '@/api/log'
import LogModal from './modules/LogModal'

const columns = [
  {
    title: '用户名称',
    align: 'center',
    dataIndex: 'userName'
  },
  {
    title: '登录账号',
    align: 'center',
    dataIndex: 'loginName'
  },
  {
    title: '访问时间',
    align: 'center',
    dataIndex: 'createTime'
  },
  {
    title: '访问IP',
    align: 'center',
    dataIndex: 'ipAddress'
  },
  {
    title: '操作类型',
    align: 'center',
    dataIndex: 'opType',
    scopedSlots: { customRender: 'opType' }
  },
  {
    title: '日志类型',
    align: 'center',
    dataIndex: 'logType',    
    scopedSlots: { customRender: 'logType' }
  },
  {
    title: '日志内容',
    align: 'center',
    dataIndex: 'logContent'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 120
  }
]

const stateMap = {
  '0': {
    state: 'success',
    text: '增加'
  },
  '1': {
    state: 'error',
    text: '删除'
  },
  '2': {
    state: 'warning',
    text: '修改'
  },
  '3': {
    state: 'default',
    text: '查询'
  }
}

export default {
  name: 'LogList',
 components: {
    LogModal
  },
  data() {
    return {
      dataSource: [],
      columns,
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共 ' + total + ' 条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      loading: false,
      screenForm: this.$form.createForm(this)
    }
  },
  filters: {
    stateFilter(type) {
      return stateMap[type].text
    },
    stateTypeFilter(type) {
      return stateMap[type].state
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData(screenData) {
      let that = this
      this.loading = true
      let obj = {
        current: that.ipagination.current,
        size: that.ipagination.pageSize,
        ...screenData
      }
      logPage(obj).then(res => {
        if (res.code === 200) {
          that.dataSource = res.data
          that.ipagination.total = res.page.total
        } else {
          that.$message.error(res.msg || '数据获取失败,请联系系统管理员')
        }
      })
      this.loading = false
    },
    // form表单条件查询
    handleScreenSubmit(e) {
      e.preventDefault()
      this.ipagination.pageNo = 1
      let { ...others } = this.screenForm.getFieldsValue()
      this.loadData({
        ...others
      })
    },
    // 重置
    handleReset() {
      this.screenForm.resetFields()
      this.loadData()
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData()
    },
    // 详情
    handleDetail: function(record) {
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.edit(record)
    },
  }
}
</script>
<style scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card {
  margin-left: -30px;
  margin-left: 1px;
  margin-right: -30px;
}

.table-page-search-wrapper {
  margin-top: -5px;
  margin-bottom: 16px;
}
</style>