<template>
  <a-row :gutter="10">
    <!--组织机构-->
    <a-col :md="6" :sm="24">
      <a-card :bordered="false">
        <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
          <template>
            <a-tree
              showLine
                @select="onSelect"
                :selectedKeys="selectedKeys"
                :treeData="departTree"
                :checkStrictly="true"
                :expandedKeys="iExpandedKeys"
                @expand="onExpand"
              />
          </template>
        </div>
      </a-card>
    </a-col>
    <!--右侧部门和用户TAB-->
    <a-col :md="18" :sm="24">
      <a-card :bordered="false">
        <a-tabs defaultActiveKey="2">
          <a-tab-pane tab="用户信息" key="2">
            <User-Base-Info ref="UserBaseInfo"></User-Base-Info>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import UserBaseInfo from './modules/UserBaseInfo'
import { departTree} from '@/api/dept'

export default {
  name: 'UserList_view',
  components: {
    UserBaseInfo
  },
  data() {
    return {
      currentDeptId: '',
      iExpandedKeys: [],
      loading: false,
      disable: true,
      visible: false,
      departTree: [],
      hiding: true,
      model: {},
      selectedKeys: [],
      allTreeKeys: [],
      form: this.$form.createForm(this)
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
      that.departTree = []
      departTree().then(res => {
        if (res.code === 200) {
          let handleTreeData = this.handleDeptTreeData(res.data)
          for (let i = 0; i < handleTreeData.length; i++) {
            let temp = handleTreeData[i]
            that.departTree.push(temp)
            that.setThisExpandedKeys(temp)
            that.getAllKeys(temp)
          }
          this.loading = false
        }else {
          this.$message.error( res.msg || '查询失败!')
        }
      })
    },
    // 处理部门树数据 ====== loadData 子方法 ======
    handleDeptTreeData(tree) {
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
    // 选择tree节点
    onSelect(selectedKeys, e) {
      let record = e.node.dataRef
      this.selectedKeys = [record.key]
      this.$refs.UserBaseInfo.onClearSelected()
      this.$refs.UserBaseInfo.open(record)
    },
    // 展开所有节点
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
    onExpand(expandedKeys) {
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },

  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>