<template>
  <a-row :gutter="10">
    <!--组织机构-->
    <a-col :md="8" :sm="24">
      <a-card :bordered="false">
        <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
          <a-input-search
            @search="onSearch"
            style="width:100%;margin-top: 10px"
            placeholder="请输入部门名称"
          />
          <template>
            <a-tree
              showLine
              :selectedKeys="selectedKeys"
              :checkStrictly="true"
              @select="onSelect"
              :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
              :treeData="departTree"
            />
          </template>
        </div>
      </a-card>
    </a-col>
    <!--右侧部门和用户TAB-->
    <a-col :md="16" :sm="24">
      <a-card :bordered="false">
        <a-tabs defaultActiveKey="2">
          <a-tab-pane tab="基本信息" key="1" forceRender>
            <Dept-Base-Info ref="DeptBaseInfo"></Dept-Base-Info>
          </a-tab-pane>
          <a-tab-pane tab="用户信息" key="2">
            <User-Base-Info ref="UserBaseInfo"></User-Base-Info>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import DeptBaseInfo from './modules/DeptBaseInfo'
import UserBaseInfo from './modules/UserBaseInfo'
import { queryDepartTreeList, searchByKeywords } from '@/api/dept'

export default {
  name: 'UserList_view',
  components: {
    DeptBaseInfo,
    UserBaseInfo
  },
  data() {
    return {
      currentDeptId: '',
      iExpandedKeys: [],
      loading: false,
      disable: true,
      treeData: [],
      visible: false,
      departTree: [],
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
      form: this.$form.createForm(this),
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
      }
    }
  },

  mounted() {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      let that = this
      that.treeData = []
      that.departTree = []
      queryDepartTreeList().then(res => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.length; i++) {
            let temp = res.data[i]
            that.treeData.push(temp)
            that.departTree.push(temp)
            that.setThisExpandedKeys(temp)
          }
          this.loading = false
        }
      })
    },
    // 部门搜索
    onSearch(value) {
      let that = this
      if (value) {
        searchByKeywords({ keyWord: value }).then(res => {
          if (res.code === 200) {
            that.departTree = []
            if (res.data) {
              for (let i = 0; i < res.data.length; i++) {
                let temp = res.data[i]
                that.departTree.push(temp)
              }
            }
          } else {
            that.$message.warning(res.msg || '数据加载错误')
          }
        })
      } else {
        that.loadTree()
      }
    },
    // 选择tree节点
    onSelect(selectedKeys, e) {
      if (this.selectedKeys[0] !== selectedKeys[0]) {
        this.selectedKeys = [selectedKeys[0]]
      }
      let record = e.node.dataRef
      this.checkedKeys.push(record.id)
      this.$refs.DeptBaseInfo.open(record)
      this.$refs.UserBaseInfo.onClearSelected()
      this.$refs.UserBaseInfo.open(record)
    },
    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },
    // =====================

    onExpand(expandedKeys) {
      console.log('onExpand')
      // console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    onCheck(checkedKeys, e) {
      console.log('onCheck')
      let record = e.node.dataRef
      this.checkedKeys = []
      this.currentDeptId = record.id
      this.checkedKeys.push(record.id)
      this.$refs.DeptBaseInfo.open(record)
      this.$refs.UserBaseInfo.open(record)
      this.hiding = false
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>