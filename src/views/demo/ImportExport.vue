<template>
<a-card :bordered="false" class="card-area">
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" :form="screenForm" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" icon="export" @click="exportExcel"  :loading="excelloading" style="margin-left: 8px" >导出Excel</a-button>
              <a-button type="primary" icon="download" @click="exportWord"  :loading="exporting" style="margin-left: 8px" >导出word</a-button>
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
        rowKey="demoId"
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
import download from '@/utils/download'
import { page } from '@/api/demo'


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
    title: '名称',
    align: 'center',
    dataIndex: 'name',
    width: 200
  },
  {
    title: '年龄',
    align: 'center',
    dataIndex: 'age',
    width: 150
  },
  {
    title: '地址',
    align: 'center',
    dataIndex: 'address',
    width: 150
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    width: 100
  },
  {
    title: '序号',
    align: 'center',
    dataIndex: 'sort',
    width: 100
  }
]

export default {
  name: 'ImportExport_view',
  data() {
    return {
      exporting: false,
      excelloading: false,
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
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      let that = this
      let screenData = this.screenForm.getFieldsValue()
      let obj = {
        current: that.ipagination.current,
        size: that.ipagination.pageSize,
        ...screenData
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
    refresh() {
      this.loading = true
      this.loadData()
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData()
    },
    // 导出word
    async exportWord() {
      this.exporting = true
      await download(
        '/demo/export/exportWord',
        false,
        false
      )
      this.exporting = false
    },
    //  导出excel
    async exportExcel () {
      this.excelloading = true
      let payload = {}
      await download('/demo/export/exportExcel', payload, false)
      this.excelloading = false
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>