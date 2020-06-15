<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <div
      :style="{width: '100%',border: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',}"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="菜单类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group
              @change="onChangeMenuType"
              v-decorator="['menuType',{'initialValue':localMenuType}]"
            >
              <a-radio :value="0">一级菜单</a-radio>
              <a-radio :value="1">子菜单</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单名称" hasFeedback>
            <a-input
              placeholder="请输入菜单名称"
              v-decorator="[ 'name', validatorRules.name]"
              :readOnly="disableSubmit"
            />
          </a-form-item>

          <a-form-item
            v-show="localMenuType!=0"
            label="上级菜单"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :validate-status="validateStatus"
            :hasFeedback="true"
            :required="true"
          >
            <span slot="help">{{ validateStatus=='error'?'请选择上级菜单':'&nbsp;&nbsp;' }}</span>
            <a-tree-select
              style="width:100%"
              :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
              :treeData="treeData"
              v-model="model.parentId"
              placeholder="请选择父级菜单"
              :disabled="disableSubmit"
              @change="handleParentIdChange"
            ></a-tree-select>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单路径">
            <a-input
              placeholder="请输入菜单路径"
              v-decorator="[ 'url',validatorRules.url]"
              :readOnly="disableSubmit"
            />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="前端组件">
            <a-input
              placeholder="请输入前端组件"
              v-decorator="[ 'component',validatorRules.component]"
              :readOnly="disableSubmit"
            />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单图标">
            <a-input placeholder="点击右侧按钮选择图标" v-model="model.icon" :readOnly="disableSubmit">
              <a-icon slot="addonAfter" type="setting" @click="selectIcons" />
            </a-input>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input-number
              placeholder="请输入菜单排序"
              style="width: 200px"
              v-decorator="[ 'sort',{'initialValue':100}]"
              :readOnly="disableSubmit"
            />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否路由菜单">
            <a-switch checkedChildren="是" unCheckedChildren="否" v-model="routeSwitch" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否隐藏菜单">
            <a-switch checkedChildren="是" unCheckedChildren="否" v-model="hiddenSwitch" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否缓存路由">
            <a-switch checkedChildren="是" unCheckedChildren="否" v-model="isKeepalive" />
          </a-form-item>
        </a-form>

        <!-- 选择图标 -->
        <icons
          @choose="handleIconChoose"
          @close="handleIconCancel"
          :iconChooseVisible="iconChooseVisible"
        ></icons>
      </a-spin>
      <a-row :style="{textAlign:'right'}">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">关闭</a-button>
        <a-button :disabled="disableSubmit" @click="handleOk" type="primary">确定</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
import { addPermission, editPermission, queryTreeList } from '@/api/permission'
import Icons from './icon/Icons'
import pick from 'lodash.pick'

export default {
  name: 'PermissionModal',
  components: { Icons },
  data() {
    return {
      drawerWidth: 700,
      treeData: [],
      treeValue: '0-0-4',
      title: '操作',
      visible: false,
      disableSubmit: false,
      model: {},
      localMenuType: 0,
      routeSwitch: true, //是否路由菜单
      hiddenSwitch: false, //是否隐藏菜单
      isKeepalive: true, //是否缓存路由
      isRequrie: true, // 是否需要验证
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),

      iconChooseVisible: false,
      validateStatus: ''
    }
  },
  computed: {
    validatorRules: function() {
      return {
        name: { rules: [{ required: true, message: '请输入菜单标题!' }] },
        component: { rules: [{ required: true, message: '请输入前端组件!' }] },
        url: { rules: [{ required: true, message: '请输入菜单路径!' }] }
      }
    }
  },
  created() {
    this.initDictConfig()
  },
  methods: {
    loadTree() {
      var that = this
      queryTreeList({'menuType':'0'}).then(res => {
        if (res.code === 200) {
          that.treeData = res.data.treeList
        }else {
          that.$message.warning(res.msg || '数据加载错误')
        }
      })
    },
    add() {
      this.edit({ status: '1', isRoute: true })
    },
    edit(record) {
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      this.form.resetFields()
      this.model = Object.assign({}, record)
      //--------------------------------------------------------------------------------------------------
      //根据菜单类型，动态展示页面字段
      if (record.route != null) {
        this.routeSwitch = record.route ? true : false
      }
      if (record.hidden != null) {
        this.hiddenSwitch = record.hidden ? true : false
      }

      if (record.keepAlive != null) {
        this.isKeepalive = record.keepAlive ? true : false
      } else {
        this.isKeepalive = false // 升级兼容 如果没有（后台没有传过来、或者是新建）默认为false
      }

      if (this.model.parentId) {
        this.localMenuType = 1
      } else {
        this.localMenuType = 0
      }
      //----------------------------------------------------------------------------------------------

      this.visible = true
      this.loadTree()
      let fieldsVal = pick(
        this.model,
        'name',
        'component',
        'url',
        'sort',
        'menuType'
      )
      this.$nextTick(() => {
        this.form.setFieldsValue(fieldsVal)
      })
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.model.isRoute = this.routeSwitch
          this.model.isHidden = this.hiddenSwitch
          this.model.keepAlive = this.isKeepalive
          let formData = Object.assign(this.model, values)
          if ((formData.menuType == 1 || formData.menuType == 2) && !formData.parentId) {
            that.validateStatus = 'error'
            that.$message.error('请检查你填的类型以及信息是否正确！')
            return
          } else {
            that.validateStatus = 'success'
          }
          that.confirmLoading = true
          if (!this.model.id) {
            this.addSubmit(formData)
          } else {
            this.editSubmit(formData)
          }
        }
      })
    },
    // 新增操作
    addSubmit(formData) {
      let that = this
      // 组装数据
      let currData = {
        parentId: formData.parentId,
        component: formData.component,
        icon: formData.icon,
        isRoute: formData.isRoute,
        keepAlive: formData.keepAlive,
        isHidden: formData.isHidden,
        menuType: formData.menuType,
        name: formData.name,
        url: formData.url,
        sort: formData.sort
      }
      addPermission(currData)
        .then(res => {
          if (res.code === 200 ) {
            that.$message.success('操作成功！')
            that.$emit('ok')
          } else {
            that.$message.warning(res.msg || '操作失败！')
          }
        })
        .finally(() => {
          that.confirmLoading = false
          that.close()
        })
    },
    // 修改操作
    editSubmit(formData) {
      let that = this
      // 组装数据
      let currData = {
        sysPermissionId: this.model.id,
        parentId: formData.parentId,
        menuType: formData.menuType,
        name: formData.name,
        url: formData.url,
        component: formData.component,
        icon: formData.icon,
        isRoute: formData.isRoute,
        isHidden: formData.isHidden,
        keepAlive: formData.keepAlive,
        status: formData.status,
        sort: formData.sort
      }
      editPermission(currData)
        .then(res => {
          if (res.code === 200) {
            that.$message.success('操作成功！')
            that.$emit('ok')
          } else {
            that.$message.warning(res.msg || '操作失败！')
          }
        })
        .finally(() => {
          that.confirmLoading = false
          that.close()
        })
    },
    handleCancel() {
      this.close()
    },
    validateNumber(rule, value, callback) {
      if (!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)) {
        callback()
      } else {
        callback('请输入正整数!')
      }
    },
    onChangeMenuType(e) {
      this.localMenuType = e.target.value
      this.$nextTick(() => {
        this.form.validateFields(['url', 'component'], { force: true })
      })
    },
    selectIcons() {
      this.iconChooseVisible = true
    },
    handleIconCancel() {
      this.iconChooseVisible = false
    },
    handleIconChoose(value) {
      this.model.icon = value
      this.form.icon = value
      this.iconChooseVisible = false
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    initDictConfig() {},
    handleParentIdChange(value) {
      if (!value) {
        this.validateStatus = 'error'
      } else {
        this.validateStatus = 'success'
      }
    }
  }
}
</script>

<style scoped>
</style>