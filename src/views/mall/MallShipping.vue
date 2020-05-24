<template>
<a-card :bordered="false" class="card-area">
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" :form="screenForm" @keyup.enter.native="searchQuery">
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
        rowKey="mallShippingId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >

      <span slot="action" slot-scope="text, record">
        <a-button @click="handleEdit(record)" type="primary" icon="edit">编辑</a-button>&nbsp;&nbsp;
        <a-button type="danger" @click="handleDelete(record.mallShippingId)" ghost icon="delete">删除</a-button>
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
import { page,delete_ } from '@/api/mall/shipping'
import DialogEdit from './modules/dialogShippingEdit'

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
    title: '收货人',
    align: 'center',
    dataIndex: 'receiverName',
    width: 200
  },
  {
    title: '联系方式',
    align: 'center',
    dataIndex: 'receiverPhone',
    width: 150
  },{
    title: '收货地址',
    align: 'center',
    dataIndex: 'receiverProvince',
    width: 250
  },
  {
    title: '详细地址',
    align: 'center',
    dataIndex: 'receiverAddress',
    width: 150
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' },
    width: 200
  }
]

export default {
  name: 'Shipping_view',
   components: {
    DialogEdit,
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
    // 新增
    handleAdd: function() {
      this.$refs.dialogEdit.add()
      this.$refs.dialogEdit.title = '新增收货地址'
    },
     // 编辑
    handleEdit: function(record) {
      this.$refs.dialogEdit.edit(record)
      this.$refs.dialogEdit.title = '编辑收货地址'
      this.$refs.dialogEdit.disableSubmit = false
    },
    // 删除
    handleDelete: function(id) {
      var that = this
      that.$confirm({
        title: '确认删除',
        content: '是否删除当前数据?',
        onOk: function() {
          delete_({ mallShippingId: id }).then(res => {
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