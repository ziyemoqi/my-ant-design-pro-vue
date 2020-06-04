<template>
<a-card :bordered="false" class="card-area">
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" :form="screenForm">
        <a-row :gutter="24">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
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
        rowKey="mallSeckillId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >

      <span slot="action" slot-scope="text, record">
        <a-button @click="handleEdit(record)" type="primary" icon="edit">编辑</a-button>&nbsp;&nbsp;
        <a-button type="danger" @click="handleDelete(record.mallSeckillId)" ghost icon="delete">删除</a-button>
      </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- form表单 -->
    <Dialog-Edit ref="dialogEdit" @ok="modalFormOk"></Dialog-Edit>

  </a-card>
</template>

<script>
import Vue from 'vue'
import download from '@/utils/download'
import { page,deleteById } from '@/api/mall/mallSeckill'
import DialogEdit from './modules/dialogMallSeckill'

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
    dataIndex: 'title',
    width: 200
  },
  {
    title: '商品',
    align: 'center',
    dataIndex: 'mallGoodName',
    width: 150
  },
  {
    title: '库存',
    align: 'center',
    dataIndex: 'stock',
    width: 150
  },
  {
    title: '开始时间',
    align: 'center',
    dataIndex: 'seckillStartTime',
    width: 100
  },
  {
    title: '结束时间',
    align: 'center',
    dataIndex: 'seckillEndTime',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' },
    width: 300
  }
]

export default {
  name: 'MallSeckill_view',
   components: {
    DialogEdit,
  },
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
        } else {
          that.$message.warning(res.msg || '操作失败!')
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
    // 新增
    handleAdd: function() {
      this.$refs.dialogEdit.add()
      this.$refs.dialogEdit.title = '新增'
    },
     // 编辑
    handleEdit: function(record) {
      this.$refs.dialogEdit.edit(record)
      this.$refs.dialogEdit.title = '编辑'
      this.$refs.dialogEdit.disableSubmit = false
    },
    // 删除
    handleDelete: function(id) {
      var that = this
      that.$confirm({
        title: '确认删除',
        content: '是否删除当前数据?',
        onOk: function() {
          deleteById({ mallSeckillId: id }).then(res => {
            if (res.code === 200) {
              that.$message.success('操作成功!')
              that.loadData()
            } else {
              that.$message.warning(res.msg || '操作失败!')
            }
          })
        }
      })
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
</style>