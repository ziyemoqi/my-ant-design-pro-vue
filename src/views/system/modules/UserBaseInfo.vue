<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <!-- FORM搜索区域 -->
      <a-form layout="inline" :form="screenForm" @submit.prevent="handleScreenSubmit">
        <a-row :gutter="10">
          <a-col :md="8" :sm="12">
            <a-form-item label="用户名称" style="margin-left:8px">
              <a-input placeholder="请输入名称查询" v-decorator="['userName',{}]"></a-input>
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
              <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
              <a-dropdown v-if="selectedRowKeys.length > 0">
                <a-menu slot="overlay">
                  <a-menu-item key="1" @click="batchDel">
                    <a-icon type="delete" />删除
                  </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                  批量操作
                  <a-icon type="down" />
                </a-button>
              </a-dropdown>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>
    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">
          {{
          selectedRowKeys.length }}
        </a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="sysUserId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span slot="sex" slot-scope="text">
          <a-tag color="green" v-if="text === 0 ">女</a-tag>
          <a-tag color="blue" v-if="text === 1 ">男</a-tag>
          <a-tag color="yellow" v-if="text === 2 ">保密</a-tag>
          <a-tag color="red" v-if="text === 3 ">未知</a-tag>
        </span>

        <span slot="state" slot-scope="text">
          <a-badge :status="text | stateTypeFilter" :text="text | stateFilter" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">详情</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定要删除此用户吗?" @confirm="() => handleDelete(record.sysUserId)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>
  </a-card>
</template>

<script>
import { userList, deleteBatch, delete_ } from '@/api/user'
import UserModal from './UserModal'
const columns = [
  {
    title: '用户名称',
    align: 'center',
    dataIndex: 'userName',
    width: 130
  },
   {
    title: '所在部门',
    align: 'center',
    dataIndex: 'departName',
    width: 130
  },
  {
    title: '联系方式',
    align: 'center',
    dataIndex: 'phone',
    width: 110
  },
  {
    title: '住址',
    align: 'center',
    dataIndex: 'address',
    width: 130
  },
  {
    title: '年龄',
    align: 'center',
    dataIndex: 'age',
    width: 80
  },
  {
    title: '性别',
    align: 'center',
    dataIndex: 'sex',

    scopedSlots: { customRender: 'sex' },
    width: 80
  },
  {
    title: '登录次数',
    align: 'center',
    dataIndex: 'loginCount',
    width: 80
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 170
  }
]

const stateMap = {
  '0': {
    state: 'success',
    text: '正常'
  },
  '1': {
    state: 'warning',
    text: '冻结'
  }
}

export default {
  name: 'UserBaseInfo',
  components: {
    UserModal
  },

  data() {
    return {
      description: '用户信息',
      currentDeptId: '',
      dataSource: [],
      columns,
      selectedRowKeys: [],
      selectionRows: [],
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
    // 加载数据
    loadData(screenData) {
      let that = this
      if (that.currentDeptId === '') return
      this.loading = true
      let obj = {
        current: that.ipagination.current,
        size: that.ipagination.pageSize,
        ...screenData,
        deptId: this.currentDeptId
      }
      userList(obj).then(res => {
        if (res.code === 200) {
          that.dataSource = res.data
          that.ipagination.total = res.page.total
        } else {
          that.$message.error(res.msg || '数据获取失败,请联系系统管理员')
        }
      })
      this.loading = false
    },
    // 选中某个部门tree节点后调用
    open(record) {
      this.currentDeptId = record.id
      this.ipagination.current = 1
      this.screenForm.resetFields()
      this.loadData()
    },
    // 初始化 清空选中数据
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    // 全选单选后的回调
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
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
    // 编辑
    handleEdit: function(record) {
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.edit(record)
    },
    // 详情
    handleDetail: function(record) {
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
      this.$refs.modalForm.edit(record)
    },
    // 增加
    handleAdd: function() {
      if (this.currentDeptId == '') {
        this.$message.error('请选择一个部门!')
      } else {
        this.$refs.modalForm.userDepartModel.departIdList = [this.currentDeptId]
        this.$refs.modalForm.add()
        this.$refs.modalForm.title = '新增'
      }
    },
    // 新增/修改 回调
    modalFormOk() {
      this.loadData()
    },
    // 删除
    handleDelete: function(id) {
      var that = this
      delete_({ sysUserId: id }).then(res => {
        if (res.code === 200) {
          that.$message.success('操作成功!')
          if (this.selectedRowKeys.length > 0) {
            for (let i = 0; i < this.selectedRowKeys.length; i++) {
              if (this.selectedRowKeys[i] == id) {
                this.selectedRowKeys.splice(i, 1)
                break
              }
            }
          }
          that.loadData()
        } else {
          that.$message.warning(res.msg || '操作失败!')
        }
      })
    },
    // 多选删除
    batchDel: function() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function() {
            // let {code,data,msg} = deleteBatch({sysUserIds:ids})
            // console.log(code+'cheongsam')
            deleteBatch({ sysUserIds: ids }).then(res => {
              if (res.code === 200) {
                that.$message.success('操作成功!')
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.msg || '操作失败!')
              }
            })
          }
        })
      }
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
  margin-right: -30px;
}

.table-page-search-wrapper {
  margin-top: -16px;
  margin-bottom: 16px;
}
</style>