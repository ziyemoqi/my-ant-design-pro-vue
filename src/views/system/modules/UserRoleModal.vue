<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="650"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
  >
    <a-form>
      <a-form-item label="所拥有的权限">
        <a-tree
          checkable
          @check="onCheck"
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          v-model="checkedKeys"
          :treeData="treeData"
        />
      </a-form-item>
    </a-form>

    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="close" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
import { queryRolePermission, saveRolePermission } from '@/api/role'
import { permissionMapTree } from '@/api/permission'

export default {
  name: 'UserRoleModal',
  data() {
    return {
      roleId: '',
      defaultCheckedKeys: [],
      checkedKeys: [],
      allTreeKeys: [],
      autoExpandParent: true,
      title: '角色权限配置页',
      visible: false,
      loading: false,
      expandedKeys: [],
      halfCheckedKeys: [],
      treeData: []
    }
  },
  methods: {
    // 显示抽屉
    show(roleId) {
      this.roleId = roleId
      this.visible = true
    },
    // 展开/关闭节点
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    // 选中节点
    onCheck(checkedKeys, { halfCheckedKeys }) {
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = halfCheckedKeys
    },
    // 关闭抽屉
    close() {
      this.reset()
      this.$emit('close')
      this.visible = false
    },
    // 清除数据
    reset() {
      this.expandedKeys = []
      this.checkedKeys = []
      this.defaultCheckedKeys = []
      this.loading = false
    },
    // 提交数据
    handleSubmit() {
      let that = this
      let checkedKeys = [...that.checkedKeys , ...that.halfCheckedKeys]
      const permissionIds = checkedKeys.join(',')
      let params = {
        sysRoleId: that.roleId,
        permissionIds,
        lastPermissionIds: that.defaultCheckedKeys.join(',')
      }
      that.loading = true
      saveRolePermission(params).then(res => {
        if (res.code === 200) {
          that.$message.success('操作成功!')
          that.loading = false
          that.close()
        } else {
          that.$message.error(res.msg || '操作失败!')
          that.loading = false
          that.close()
        }
      })
    },
    convertTreeListToKeyLeafPairs(treeList, keyLeafPair = []) {
      for (const { key, leaf, children } of treeList) {
        keyLeafPair.push({ key, leaf })
        if (children && children.length > 0) {
          this.convertTreeListToKeyLeafPairs(children, keyLeafPair)
        }
      }
      return keyLeafPair
    }

  },
  watch: {
    visible() {
      console.log(1)
      if (this.visible) {
        permissionMapTree().then(res => {
          console.log(2)
          this.treeData = res.data.treeList
          this.allTreeKeys = res.data.ids
          const keyLeafPairs = this.convertTreeListToKeyLeafPairs(this.treeData)
          queryRolePermission({ sysRoleId: this.roleId }).then(res => {
            console.log(3)
            const checkedKeys = [...res.data].filter(key => {
              const keyLeafPair = keyLeafPairs.filter(item =>item.key === key)[0]
              return keyLeafPair  && keyLeafPair.leaf
            })
            const halfCheckedKeys = [...res.data].filter(key => {
              const keyLeafPair = keyLeafPairs.filter(item => item.key === key)[0]
              return keyLeafPair && !keyLeafPair.leaf
            })
            this.checkedKeys = [...checkedKeys]
            this.halfCheckedKeys = [...halfCheckedKeys]
            this.defaultCheckedKeys = [...halfCheckedKeys, ...checkedKeys]
            this.expandedKeys = this.allTreeKeys
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>