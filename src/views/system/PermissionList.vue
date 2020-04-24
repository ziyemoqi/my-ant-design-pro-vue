<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button
        @click="batchDel"
        v-if="selectedRowKeys.length > 0"
        ghost
        type="primary"
        icon="delete"
      >批量删除</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;
        <a style="font-weight: 600">
          {{
          selectedRowKeys.length }}
        </a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        :columns="columns"
        size="middle"
        :pagination="false"
        :dataSource="dataSource"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      >
        <span slot="action" slot-scope="text, record">
          <span v-if="record.menuType !== 2">
            <a-button @click="handleEdit(record)" type="primary" icon="edit">编辑</a-button>&nbsp;
            <a-button @click="handleDetail(record)" type="primary" icon="diff">详情</a-button>&nbsp;
            <a-button type="danger" @click="handleDelete(record.id)" ghost icon="delete">删除</a-button>
          </span>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <permission-modal ref="modalForm" @ok="modalFormOk"></permission-modal>
  </a-card>
</template>

<script>
import PermissionModal from './modules/PermissionModal'
import { getPermissionList,deleteBatch,delete_ } from '@/api/permission'

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '菜单类型',
    dataIndex: 'menuType',
    key: 'menuType',
    align: 'center',
    customRender: function(text) {
      if (text == 0) {
        return '菜单'
      } else if (text == 1) {
        return '菜单'
      } else if (text == 2) {
        return '按钮/权限'
      } else {
        return text
      }
    }
  },
  {
    title: '路径',
    dataIndex: 'url',
    key: 'url',
    align: 'center',
    scopedSlots: { customRender: 'url' }
  },
  {
    title: '组件',
    dataIndex: 'component',
    key: 'component',
    align: 'center',
    scopedSlots: { customRender: 'component' }
  },
  {
    title: '权限编码',
    dataIndex: 'permsCode',
    key: 'permsCode',
    align: 'center',
    width: 300,
    scopedSlots: { customRender: 'permsCode' }
  },
  {
    title: '排序',
    align: 'center',
    dataIndex: 'sort',
    key: 'sort'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 350
  }
]

export default {
  name: 'PermissionList_view',
  components: {
    PermissionModal,
  },
  data() {
    return {
      columns: columns,
      loading: false,
      selectedRowKeys: [],
      selectionRows: [],
      dataSource: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData() {
      let that = this
      this.dataSource = []
      let { code, data, msg } = await getPermissionList()
      if (code === 200) {
        that.dataSource = data
      } else {
        that.$message.error(msg || '数据获取失败,请联系系统管理员')
      }
    },
    // 打开数据规则编辑
    handleDataRule(record) {
      this.$refs.PermissionDataRuleList.edit(record)
    },
    // 新增
    handleAdd: function() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    handleDetail:function(record){
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title="详情";
      this.$refs.modalForm.disableSubmit = true;
    },
    // 新增/修改 成功时，重载列表
    modalFormOk() {
      this.loadData()
    },
    // 编辑
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    // 删除
    handleDelete: function (id) {
      var that = this
      that.$confirm({
        title: '确认删除',
        content: '是否删除当前数据?',
        onOk: function() {
          delete_({ sysPermissionId: id }).then(res => {
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
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
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
            deleteBatch({ ids: ids }).then(res => {
              if (res.code === 200) {
                that.$message.success('操作成功!')
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning( msg || '操作失败!')
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
@import '~@assets/less/common.less';
</style>