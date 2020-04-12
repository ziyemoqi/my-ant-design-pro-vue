<template>
  <a-card :bordered="false" class="card-area">
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" :form="screenForm" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="商品名称" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="请输入..." v-decorator="['name']"></a-input>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button @click="handleAdd" type="primary" icon="plus" >新增</a-button>
              <a-button type="primary" icon="search" @click="searchQuery" style="margin-left:10px">查询</a-button>
              <a-button
                style="margin-left: 8px"
                type="primary"
                icon="reload"
                @click="searchReset"
              >重置</a-button>
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
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="mallGoodId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a-button @click="handleEdit(record)" type="primary" icon="edit">编辑</a-button>&nbsp;&nbsp;
          <a-button @click="handleDelete(record.mallGoodId)" type="primary" icon="delete">删除</a-button>&nbsp;&nbsp;
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- form表单 -->
    <Dialog-Edit ref="dialogEdit" @ok="modalFormOk"></Dialog-Edit>
  </a-card>
</template>

<script>
import DialogEdit from './modules/dialogGoodEdit'
import Vue from 'vue'
import { page,delete_ } from '@/api/mall/mallGood'

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
    title: '商品名称',
    align: 'center',
    dataIndex: 'name',
    width: 200
  },
  {
    title: '图片',
    align: 'center',
    dataIndex: 'pic',
    width: 150
  },
  {
    title: '商品描述',
    align: 'center',
    dataIndex: 'description',
    width: 150
  },
  {
    title: '价格',
    dataIndex: 'price',
    align: 'center',
    width: 120
  },
  {
    title: '销量',
    dataIndex: 'sale',
    align: 'center',
    width: 100
  },
  {
    title: '库存',
    align: 'center',
    dataIndex: 'stock',
    width: 100
  },
  {
    title: '库存预警',
    align: 'center',
    dataIndex: 'lowStock',
    width: 100
  },
  {
    title: '排序',
    align: 'center',
    dataIndex: 'sort',
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
  name: 'mallBrandList_view',
  components: {
    DialogEdit
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
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData(screenData) {
      let that = this
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
    // 表单查询
    searchQuery(e) {
      e.preventDefault()
      this.ipagination.current = 1
      let { ...others } = this.screenForm.getFieldsValue()
      this.loadData({
        ...others
      })
    },
    // 表单重置
    searchReset() {
      this.screenForm.resetFields()
      this.ipagination.current = 1
      this.loadData()
    },
    // 新增
    handleAdd: function() {
      this.$refs.dialogEdit.add()
      this.$refs.dialogEdit.title = '新增'
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
    // 新增/修改 成功时，重载列表
    modalFormOk() {
      this.loadData()
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
          delete_({ mallGoodId: id }).then(res => {
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