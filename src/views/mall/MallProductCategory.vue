<template xmlns:background-color="http://www.w3.org/1999/xhtml">
  <a-row :gutter="10">
    <a-col :md="9" :sm="24">
      <a-card :bordered="false">
        <!-- 按钮操作区域 -->
        <a-row style="margin-left: 14px">
          <a-button @click="handleAdd(1)" type="primary">添加一级类目</a-button>
          <a-button @click="handleAdd(2)" type="primary">添加子级类目</a-button>
          <a-button @click="refresh" type="default" icon="reload" :loading="loading">刷新</a-button>
          <a-button @click="backFlowList" type="default" icon="rollback" :loading="loading">返回</a-button>
        </a-row>
        <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
          <a-alert type="info" :showIcon="true">
            <div slot="message">
              当前选择：
              <a v-if="this.currSelected.title">{{ getCurrSelectedTitle() }}</a>
              <a
                v-if="this.currSelected.title"
                style="margin-left: 10px"
                @click="onClearSelected"
              >取消选择</a>
            </div>
          </a-alert>
          <!-- 树-->
          <a-col :md="10" :sm="24">
            <template>
              <a-dropdown :trigger="[this.dropTrigger]">
                <span style="user-select: none">
                  <a-tree
                    checkable
                    multiple
                    @select="onSelect"
                    @check="onCheck"
                    :selectedKeys="selectedKeys"
                    :checkedKeys="checkedKeys"
                    :treeData="treeData"
                    :checkStrictly="checkStrictly"
                    :expandedKeys="iExpandedKeys"
                    :autoExpandParent="autoExpandParent"
                    @expand="onExpand"
                  />
                </span>
              </a-dropdown>
            </template>
          </a-col>
        </div>
      </a-card>
      <!---- for:树操作 =======------>
      <div class="drawer-bootom-button">
        <a-dropdown :trigger="['click']" placement="topCenter">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
            <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
            <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
            <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
            <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
            <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
          </a-menu>
          <a-button>
            树操作
            <a-icon type="up" />
          </a-button>
        </a-dropdown>
      </div>
      <!---- for:树操作 =======------>
    </a-col>
    <!-- table区域-begin -->
    <a-col :md="15" :sm="24">
      <a-card :bordered="false">
        <a-tabs defaultActiveKey="2">
          <a-tab-pane tab="类目信息" key="2">
            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
              <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
              <a style="font-weight: 600">{{selectedRowKeys.length }}</a>项
              <a style="margin-left: 24px" @click="onClearListSelected">清空</a>
            </div>
            <div style="background-color:white">
              <a-table
                ref="table"
                size="middle"
                :bordered="true"
                rowKey="mallProductCategoryId"
                :columns="columns"
                :dataSource="listDataSource"
                :pagination="ipagination"
                :loading="listLoading"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                @change="handleTableChange"
              >
                <span slot="action" slot-scope="text, record">
                  <a @click="handleEdit(record)">编辑</a>
                  <a-divider type="vertical" />
                  <a href="javascript:;" @click="handleDelete(record.mallProductCategoryId)">删除</a>
                </span>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
    <mall-product-category ref="classModal" @ok="add_loadTree"></mall-product-category>
  </a-row>
</template>
<script>
import mallProductCategory from './modules/dialogMallProductCategory'
import pick from 'lodash.pick'
import { classTree, childrenClass,delete_ } from '@/api/mall/mallProductCategory'
const columns = [
  {
    title: '类目名称',
    align: 'center',
    dataIndex: 'name',
    width: 130
  },
  {
    title: '序号',
    align: 'center',
    dataIndex: 'sort',
    width: 90
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 180
  }
]

export default {
  name: 'MallProductCategoryList_view',
  components: {
    mallProductCategory
  },
  data() {
    return {
      columns,
      treeData: [],
      listDataSource: [],
      selectionRows: [],
      form: this.$form.createForm(this),
      screenForm: this.$form.createForm(this),
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共 ' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      iExpandedKeys: [],
      loading: false,
      listLoading: false,
      autoExpandParent: true,
      hiding: true,
      model: {},
      dropTrigger: '',
      disableSubmit: false,
      checkedKeys: [],
      selectedKeys: [],
      autoIncr: 1,
      currSelected: {},
      allTreeKeys: [],
      checkStrictly: true,
      selectedRowKeys: []
    }
  },
  mounted() {
    this.loadTree()
  },
  methods: {
    // 加载类目树
    async loadTree() {
      var that = this
      that.loading = true
      that.treeData = []
      try {
        let { code, data, msg } = await classTree()
        if (code === 200) {
          let handleTreeData = this.handleClassTreeData(data)
          for (let i = 0; i < handleTreeData.length; i++) {
            let temp = handleTreeData[i]
            that.treeData.push(temp)
            that.setThisExpandedKeys(temp)
            that.getAllKeys(temp)
          }
        } else {
          that.$message.error(msg || '数据获取失败,请联系系统管理员')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    // 处理树数据 ====== loadTree 子方法 ======
    handleClassTreeData(tree) {
      for (let node of tree) {
        node.key = node.id
        node.value = node.id
        node.scopedSlots = {
          icon: 'icon',
          title: 'title'
        }
        if (node.children) node.children = this.handleClassTreeData(node.children)
      }
      return tree
    },
    setThisExpandedKeys(node) {
      if (node.children && node.id === 'root') {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },
    getAllKeys(node) {
      this.allTreeKeys.push(node.key)
      if (node.children && node.children.length > 0) {
        for (let a = 0; a < node.children.length; a++) {
          this.getAllKeys(node.children[a])
        }
      }
    },
    // 刷新
    refresh() {
      this.loading = true
      this.onClearSelected()
      this.loadTree()
    },
    // 展开/收起节点时触发
    onExpand(expandedKeys) {
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 点击复选框触发 -切换父子勾选模式
    onCheck(checkedKeys, info) {
      this.hiding = false
      if (this.checkStrictly) {
        this.checkedKeys = checkedKeys.checked
      } else {
        this.checkedKeys = checkedKeys
      }
    },
    // 点击树节点触发
    onSelect(selectedKeys, e) {
      this.hiding = false
      let record = e.node.dataRef
      this.selectedKeys = [record.key]
      this.currSelected = Object.assign({}, record)
      let obj = {
        current: this.ipagination.current,
        size: this.ipagination.pageSize,
        parentId: record.id
      }
      this.queryChildrenClass(obj)
    },
    // 触发onSelect事件时,查询右侧list
    queryChildrenClass(obj) {
      let that = this
      this.listLoading = true
      try {
        childrenClass(obj).then(res => {
          if (res.code === 200) {
            that.listDataSource = res.data
            that.ipagination.total = res.page.total
          } else {
            that.$message.error(res.msg || '数据获取失败,请联系系统管理员')
          }
        })
      } catch (e) {
        console.error(e)
      } finally {
        this.listLoading = false
      }
    },
    // 返回上一页
    backFlowList() {
      this.$router.back(-1)
    },
    // 全选单选后的回调
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    // 初始化 清空选中数据
    onClearListSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      let others = this.screenForm.getFieldsValue()
      this.queryChildrenClass({
        parentId: this.currSelected.key,
        current: pagination.current,
        size: this.ipagination.pageSize,
        ...others
      })
    },
    // 当前选择
    getCurrSelectedTitle() {
      return !this.currSelected.title ? '' : this.currSelected.title
    },
    // 取消选择
    onClearSelected() {
      this.hiding = true
      this.checkedKeys = []
      this.currSelected = {}
      this.form.resetFields()
      this.selectedKeys = []
    },
    // 类目新增
    handleAdd(num) {
      this.$refs.classModal.title = '新增'
      this.$refs.classModal.addFlag = true
      if (num == 1) {
        this.$refs.classModal.add()
      } else {
        let key = this.currSelected.key
        if (!key) {
          this.$message.warning('请先选中一条记录!')
          return false
        }
        this.$refs.classModal.add(key)
      }
    },
    // 类目新增后的回调
    add_loadTree() {
      this.loadTree()
      let obj = {
        parentId: this.currSelected.key,
        current: 1,
        size: this.ipagination.pageSize
      }
      this.queryChildrenClass(obj)
    },
    // 重置
    emptyCurrForm() {
      this.form.resetFields()
    },
    // list 编辑
    handleEdit: function(record) {
      this.$refs.classModal.title = '编辑'
      this.$refs.classModal.addFlag = false
      this.$refs.classModal.disableSubmit = false
      this.$refs.classModal.edit(record)
    },
    // list 详情
    handleDetail(record) {
      this.$refs.classModal.title = '详情'
      this.$refs.classModal.addFlag = false
      this.$refs.classModal.disableSubmit = true
      this.$refs.classModal.edit(record)
    },
    // 删除单条信息
    handleDelete(mallProductCategoryId) {
      let _this = this
      _this.$confirm({
        title: '提示',
        content: '您确定要删除此类目吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          delete_({ mallProductCategoryId: mallProductCategoryId }).then(resp => {
            if (resp.code === 200) {
              _this.$message.success('删除成功!')
              _this.loadTree()
              _this.queryChildrenClass({ parentId: _this.currSelected.key })
            } else {
              _this.$message.error(resp.msg || '删除失败!')
            }
          })
        },
      })
    },
    // 多选删除
    listBatchDel: function() {
      let that = this
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function() {
            deleteBatch({ ids: ids }).then(res => {
              if (res.code === 200) {
                that.$message.success('删除成功!')
                that.loadTree()
                that.queryChildrenClass({
                  parentId: that.currSelected.key,
                  current: 1,
                  size: that.ipagination.pageSize
                })
                that.selectedRowKeys = []
                that.selectionRows = []
              } else {
                that.$message.warning(msg || '删除失败!')
              }
            })
          }
        })
      }
    },
    // <!---- for:切换父子勾选模式 =======------>
    expandAll() {
      this.iExpandedKeys = this.allTreeKeys
    },
    closeAll() {
      this.iExpandedKeys = []
    },
    checkALL() {
      this.checkStriccheckStrictlytly = false
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL() {
      this.checkedKeys = []
    },
    switchCheckStrictly(v) {
      if (v == 1) {
        this.checkStrictly = false
      } else if (v == 2) {
        this.checkStrictly = true
      }
    }
    //  <!---- for:切换父子勾选模式 =======------>
  }
}
</script>
<style scoped>
.ant-card-body .table-operator {
  margin: 15px;
}

.anty-form-btn {
  width: 100%;
  text-align: center;
}

.anty-form-btn button {
  margin: 0 5px;
}

.anty-node-layout .ant-layout-header {
  padding-right: 0;
}

.header {
  padding: 0 8px;
}

.header button {
  margin: 0 3px;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

#app .desktop {
  height: auto !important;
}

/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.drawer-bootom-button {
  /*position: absolute;*/
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>