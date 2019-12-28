<template xmlns:background-color="http://www.w3.org/1999/xhtml">
  <a-row :gutter="10">
    <a-col :md="8" :sm="24">
      <a-card :bordered="false">
        <!-- 按钮操作区域 -->
        <a-row style="margin-left: 14px">
          <a-button @click="handleAdd(2)" type="primary">添加子部门</a-button>
          <a-button @click="handleAdd(1)" type="primary">添加一级部门</a-button>
          <a-button title="删除多条数据" @click="batchDel" type="default">批量删除</a-button>
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
          <a-input-search
            @search="onSearch"
            style="width:100%;margin-top: 10px"
            placeholder="请输入部门名称"
          />
          <!-- 树-->
          <a-col :md="10" :sm="24">
            <template>
              <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
                <span style="user-select: none">
                  <a-tree
                    checkable
                    multiple
                    @select="onSelect"
                    @check="onCheck"
                    @rightClick="rightHandle"
                    :selectedKeys="selectedKeys"
                    :checkedKeys="checkedKeys"
                    :treeData="treeData"
                    :checkStrictly="checkStrictly"
                    :expandedKeys="iExpandedKeys"
                    :autoExpandParent="autoExpandParent"
                    @expand="onExpand"
                  />
                </span>
                <!--新增右键点击事件,和增加添加和删除功能-->
                <a-menu slot="overlay">
                  <a-menu-item @click="handleAdd(3)" key="1">添加</a-menu-item>
                  <a-menu-item @click="handleDelete" key="2">删除</a-menu-item>
                  <a-menu-item @click="closeDrop" key="3">取消</a-menu-item>
                </a-menu>
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
    <a-col :md="16" :sm="24">
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">
          {{
          selectedRowKeys.length }}
        </a>项
        <a style="margin-left: 24px" @click="onClearListSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="sysUserId"
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
    </a-col>
    <depart-modal ref="departModal" @ok="loadTree"></depart-modal>
  </a-row>
</template>
<script>
import DepartModal from './modules/DepartModal'
import pick from 'lodash.pick'
import { queryDepartTreeList, childrenDept, searchByKeywords, deleteByDepartId, deleteBatch, editByDeptId } from '@/api/dept'

const columns = [
  {
    title: '部门名称',
    align: 'center',
    dataIndex: 'departName'
  },
  {
    title: '负责人',
    align: 'center',
    dataIndex: 'managerName'
  },
  {
    title: '办公电话',
    align: 'center',
    dataIndex: 'telephone'
  },
  {
    title: '机构类型',
    align: 'center',
    dataIndex: 'orgType'
  },
  {
    title: '地址',
    align: 'center',
    dataIndex: 'address'
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'state'
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
  name: 'DepartList_view',
  components: {
    DepartModal
  },
  data() {
    return {
      detailTree: [],
      columns,
      treeData: [],
      listDataSource: [],
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
      iExpandedKeys: [],
      loading: false,
      listLoading: false,
      autoExpandParent: true,
      currFlowId: '',
      currFlowName: '',
      disable: true,
      visible: false,
      rightClickSelectedKey: '',
      hiding: true,
      model: {},
      dropTrigger: '',
      depart: {},
      disableSubmit: false,
      checkedKeys: [],
      selectedKeys: [],
      autoIncr: 1,
      currSelected: {},
      allTreeKeys: [],
      checkStrictly: true,
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      graphDatasource: {
        nodes: [],
        edges: []
      },
      validatorRules: {
        departName: { rules: [{ required: true, message: '请输入机构/部门名称!' }] },
        uniqueCoding: { rules: [{ required: true, message: '请输入机构编码!' }] },
        orgCategory: { rules: [{ required: true, message: '请输入机构类型!' }] }
      }
    }
  },
  created() {
    this.currFlowId = this.$route.params.id
    this.currFlowName = this.$route.params.name
  },
  mounted() {
    this.loadTree()
  },
  methods: {
    async loadTree() {
      var that = this
      that.loading = true
      that.detailTree = []
      that.treeData = []
      try {
        let { code, data, msg } = await queryDepartTreeList()
        if (code === 200) {
            let handleTreeData = this.handleDeptTreeData(data)
          for (let i = 0; i < handleTreeData.length; i++) {
            let temp = handleTreeData[i]
            that.detailTree.push(temp)
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
    handleDeptTreeData (tree) {
      for (let node of tree) {
        node.key = node.id
        node.value = node.id
        node.scopedSlots = {
          icon: 'icon',
          title: 'title'
        }
        if (node.children) node.children = this.handleDeptTreeData(node.children)
      }
      return tree
    },
    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
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
      this.loadTree()
    },
    // 右键操作方法
    rightHandle(node) {
      this.dropTrigger = 'contextmenu'
      this.rightClickSelectedKey = node.node.eventKey
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
      // console.log(this.currSelected)
      // this.model = this.currSelected
      // this.model.parentId = record.parentId
      this.setValuesToList(record.id)
    },
    // 触发onSelect事件时,查询左侧list
    setValuesToList(id) {
      console.log(id)
      let that = this
      let obj = {
        page: {
          pageNo: that.ipagination.current,
          pageSize: that.ipagination.pageSize
        },
        params: {
          parentId: id
        }
      }
      this.listLoading = true
      childrenDept(obj).then(res => {
        if (res.code === 200) {
          console.log('调用成功!')
          that.dataSource = res.data
          that.ipagination.total = res.page.total
        }else{
           that.$message.error(res.msg || '数据获取失败,请联系系统管理员')
        }
      })
      this.loading = false
      // this.childrenDept(id)
      // this.form.setFieldsValue(
      //   pick(record, 'title', 'orgType', 'uniqueCoding', 'sort', 'telephone', 'address', 'remark')
      // )
    },
    // 返回上一页
    backFlowList() {
      this.$router.back(-1)
    },
    // 右键点击下拉框改变事件
    dropStatus(visible) {
      if (visible == false) {
        this.dropTrigger = ''
      }
    },
    // 右键点击下拉关闭下拉框
    closeDrop() {
      this.dropTrigger = ''
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
      this.loadData()
    },
    // 保存并提交
    submitCurrForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.currSelected.id) {
            this.$message.warning('请点击选择要修改部门!')
            return
          }
          let formData = {
            sysDeptId: this.currSelected.id,
            ...values
          }
          try {
            editByDeptId(formData).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功!')
              } else {
                this.$message.error(res.msg || '保存失败！')
              }
            })
          } catch (e) {
            console.log(e)
          } finally {
            this.loadTree()
          }
        }
      })
    },
    // 批量删除
    batchDel: function() {
      if (this.checkedKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
      } else {
        var ids = ''
        for (var a = 0; a < this.checkedKeys.length; a++) {
          ids += this.checkedKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '确定要删除所选中的 ' + this.checkedKeys.length + ' 条数据，及子节点数据吗?',
          onOk: function() {
            deleteBatch({ ids: ids }).then(res => {
              if (res.code === 200) {
                that.$message.success('删除成功!')
                that.loadTree()
                that.onClearSelected()
              } else {
                that.$message.warning( msg || '删除失败!')
              }
            })
          }
        })
      }
    },
    // 部门搜索
    onSearch(value) {
      let that = this
      if (value) {
        searchByKeywords({ keyWord: value }).then(res => {
          if (res.code === 200) {
            that.treeData = []
            if (res.data) {
              for (let i = 0; i < res.data.length; i++) {
                let temp = res.data[i]
                that.treeData.push(temp)
              }
            }
          } else {
            that.$message.error(res.msg || '查询失败！')
          }
        })
      } else {
        that.loadTree()
      }
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
    // 新增
    handleAdd(num) {
      if (num == 1) {
        this.$refs.departModal.add()
        this.$refs.departModal.title = '新增'
      } else if (num == 2) {
        let key = this.currSelected.key
        if (!key) {
          this.$message.warning('请先选中一条记录!')
          return false
        }
        this.$refs.departModal.add(this.selectedKeys)
        this.$refs.departModal.title = '新增'
      } else {
        this.$refs.departModal.add(this.rightClickSelectedKey)
        this.$refs.departModal.title = '新增'
      }
    },
    // 删除单条信息
    handleDelete() {
      deleteByDepartId({ sysDeptId: this.rightClickSelectedKey }).then(resp => {
        if (resp.code === 200) {
          this.$message.success('删除成功!')
          this.loadTree()
        } else {
          this.$message.error( resp.msg || '删除失败!')
        }
      })
    },
    // 重置
    emptyCurrForm() {
      this.form.resetFields()
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