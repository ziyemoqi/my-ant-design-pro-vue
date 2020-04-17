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
              <a-input placeholder="请输入..." v-decorator="['loginName']"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="12">
              <a-form-item label="访问时间">
                <a-range-picker
                  v-decorator="['dateRange']"
                  :showTime="{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]
            }"
              format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="12">
              <a-form-item label="操作类型" style="margin-left:8px">
                <a-select
                  v-decorator="['opType',{normalize: trimNormalizer,}]"
                  placeholder="请选择操作类型"
                >
                  <a-select-option value="0">增加</a-select-option>
                  <a-select-option value="1">删除</a-select-option>
                  <a-select-option value="2">修改</a-select-option>
                  <a-select-option value="3">查询</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="12" style="margin-left:8px">
              <a-form-item label="日志类型">
                <a-select
                  v-decorator="['logType',{normalize: trimNormalizer,}]"
                  placeholder="请选择日志类型"
                >
                  <a-select-option value="0">操作日志</a-select-option>
                  <a-select-option value="1">登录日志</a-select-option>
                  <a-select-option value="2">定时任务</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" style="margin-left: 18px" html-type="submit">查询</a-button>
              <a-button
                type="primary"
                icon="reload"
                style="margin-left: 8px"
                @click="handleReset"
              >重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
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
    <Log-modal ref="modalForm"></Log-modal>
  </a-card>
</template>

<script>
import { logPage } from '@/api/log'
import LogModal from './modules/LogModal'
import moment from 'moment'

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
    title: '耗时',
    align: 'center',
    dataIndex: 'costTime'
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
    let trimNormalizer = x => {
      if (typeof x === 'undefined') return
      if (typeof x !== 'string') x = String(x)
      return x.trim()
    }
    return {
      dataSource: [],
      columns,
      ipagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共 ' + total + ' 条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
      },
      loading: false,
      screenForm: this.$form.createForm(this),
      trimNormalizer,
      toggleSearchStatus: false,
      moment
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
    loadData() {
      let that = this
      this.loading = true
      let screenForm = this.screenForm.getFieldsValue()
      if (screenForm.dateRange) {
        screenForm['beginTime'] = screenForm.dateRange[0].format('YYYY-MM-DD')
        screenForm['endTime'] = screenForm.dateRange[1].format('YYYY-MM-DD')
        this.$delete(screenForm,'dateRange')
      }
      let obj = {
        current: that.ipagination.current,
        size: that.ipagination.pageSize,
        ...screenForm
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
      this.ipagination.current = 1
      this.loadData()
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
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus
    }
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