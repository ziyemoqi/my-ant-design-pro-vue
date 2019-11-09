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
                <a href="javascript:;" @click="handleAddSub(record)">添加子菜单</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
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
  },{
    title: 'icon',
    dataIndex: 'icon',
    key: 'icon'
  },
  {
    title: '组件',
    dataIndex: 'component',
    key: 'component',
    scopedSlots: { customRender: 'component' }
  },
  {
    title: '路径',
    dataIndex: 'url',
    key: 'url',
    scopedSlots: { customRender: 'url' }
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 150
  }
]

export default {
  name: 'PermissionList_view',
  components: {
    PermissionModal,
  },
  data() {
    return {
      description: '这是菜单管理页面',
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
    handleAddSub(record) {
      this.$refs.modalForm.title = '添加子菜单'
      this.$refs.modalForm.localMenuType = 1
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.edit({ status: '1', permsType: '1', route: true, parentId: record.id })
    },
    handleDelete: function (id) {
      var that = this
      delete_({sysPermissionId: id}).then((res) => {
        if (res.code === 200 ) {
          that.$message.success('操作成功！');
          that.loadData();
        } else {
          that.$message.error(res.msg || '操作失败！');
        }
      });
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