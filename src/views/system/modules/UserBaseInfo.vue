<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <!-- FORM搜索区域 -->
      <a-form layout="inline" :form="screenForm" @submit.prevent="handleScreenSubmit">
        <a-row :gutter="10">
          <a-col :md="10" :sm="12">
            <a-form-item label="用户账号" style="margin-left:8px">
              <a-input placeholder="请输入名称查询" v-decorator="['loginName',{}]"></a-input>
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
    <!-- 操作按钮区域 -->
    <div class="table-operator" :md="24" :sm="24" style="margin: -46px 0px 10px 2px">
      <a-button @click="handleAdd" type="primary" icon="plus" style="margin-top: 16px">用户录入</a-button>
      <a-button @click="handleAddUserDepart" type="primary" icon="plus">添加已有用户</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />删除关系
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
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
                <a-popconfirm title="确定要删除关系吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除关系</a>
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
    <!-- <Select-User-Modal ref="selectUserModal" @selectFinished="selectOK"></Select-User-Modal> -->
  </a-card>
</template>

<script>
import { get, post, deleteAction } from '@/api/manage'
import { userList } from '@/api/user'
//   import SelectUserModal from './SelectUserModal'
import UserModal from './UserModal'
const columns = [
  {
    title: '用户账号',
    align: 'center',
    dataIndex: 'loginName'
  },
  {
    title: '用户名称',
    align: 'center',
    dataIndex: 'userName'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 170
  }
]
export default {
  name: 'UserBaseInfo',
  components: {
    //   SelectUserModal,
    UserModal
  },

  data() {
    return {
      description: '用户信息',
      currentDeptId: '',
      dataSource: [],
      columns,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
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
      /* table加载状态 */
      loading: false,
      screenForm: this.$form.createForm(this)
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    //   加载数据
    loadData(screenData) {
      let that = this
      if (that.currentDeptId === '') return
      let obj = {
        page: {
          pageNo: that.ipagination.current,
          pageSize: that.ipagination.pageSize
        },
        params: {
          ...screenData,
          deptId: this.currentDeptId
        }
      }
      this.loading = true
      userList(obj).then(res => {
        if (res.code === 200) {
          that.dataSource = res.data
          that.ipagination.total = res.page.total
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
    // 初始化
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
      console.log('handleEdit')
      this.$message.info('功能开发中,敬请期待！')
      // this.$refs.modalForm.title = '编辑'
      // this.$refs.modalForm.departDisabled = true
      // this.$refs.modalForm.disableSubmit = false
      // this.$refs.modalForm.edit(record)
    },
    // 新增/修改 回调
    modalFormOk() {
      this.loadData()
    },
    // 用户增加
    handleAdd: function() {
      console.log('handleAdd')
      this.$message.info('功能开发者,敬请期待！')
      // if (this.currentDeptId == '') {
      //   this.$message.error('请选择一个部门!')
      // } else {
      //   this.$refs.modalForm.departDisabled = true
      //   this.$refs.modalForm.userDepartModel.departIdList = [this.currentDeptId] //传入一个部门id
      //   this.$refs.modalForm.add()
      //   this.$refs.modalForm.title = '新增'
      // }
    },
    // 添加已有用户
    handleAddUserDepart() {
      // if (this.currentDeptId == '') {
      //   this.$message.error('请选择一个部门!')
      // } else {
      //   this.$refs.selectUserModal.visible = true
      // }
      this.$message.info('功能开发者,敬请期待！')
    },
    // 删除已选用户
    handleDelete: function(id) {
      console.log('handleDelete')
      this.$message.info('功能开发者,敬请期待！')
      // if (!this.url.delete) {
      //   this.$message.error('请设置url.delete属性!')
      //   return
      // }
      // var that = this
      // deleteAction(that.url.delete, { depId: this.currentDeptId, userId: id }).then(res => {
      //   console.log(3)
      //   if (res.success) {
      //     that.$message.success(res.message)
      //     if (this.selectedRowKeys.length > 0) {
      //       for (let i = 0; i < this.selectedRowKeys.length; i++) {
      //         if (this.selectedRowKeys[i] == id) {
      //           this.selectedRowKeys.splice(i, 1)
      //           break
      //         }
      //       }
      //     }
      //     that.loadData()
      //   } else {
      //     that.$message.warning(res.message)
      //   }
      // })
    },
    // 删除单条数据
    batchDel: function() {
      this.$message.info('功能开发中,敬请期待！')
      // if (!this.url.deleteBatch) {
      //   this.$message.error('请设置url.deleteBatch属性!')
      //   return
      // }
      // if (this.selectedRowKeys.length <= 0) {
      //   this.$message.warning('请选择一条记录！')
      //   return
      // } else {
      //   var ids = ''
      //   for (var a = 0; a < this.selectedRowKeys.length; a++) {
      //     ids += this.selectedRowKeys[a] + ','
      //   }
      //   var that = this
      //   console.log(this.currentDeptId)
      //   this.$confirm({
      //     title: '确认删除',
      //     content: '是否删除选中数据?',
      //     onOk: function() {
      //       deleteAction(that.url.deleteBatch, { depId: that.currentDeptId, userIds: ids }).then(res => {
      //         if (res.success) {
      //           that.$message.success(res.message)
      //           that.loadData()
      //           that.onClearSelected()
      //         } else {
      //           that.$message.warning(res.message)
      //         }
      //       })
      //     }
      //   })
      // }
    },
    // ===================

    clearList() {
      console.log(5)
      this.currentDeptId = ''
      this.dataSource = []
    },
    hasSelectDept() {
      console.log(6)
      if (this.currentDeptId == null) {
        this.$message.error('请选择一个部门!')
        return false
      }
      return true
    },

    selectOK(data) {
      let params = {}
      params.depId = this.currentDeptId
      params.userIdList = []
      for (var a = 0; a < data.length; a++) {
        params.userIdList.push(data[a])
      }
      console.log(params)
      post(this.url.edit, params).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      })
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