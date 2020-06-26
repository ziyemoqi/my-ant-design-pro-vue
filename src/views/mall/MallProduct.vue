<template>
  <a-card :bordered="false" class="card-area">
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" :form="screenForm" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="商品名称" >
              <a-input placeholder="请输入..." v-decorator="['name']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <a-form-item label="商品类目"  >
              <a-cascader
                :options="classOptions"
                placeholder="请选择..."
                v-decorator="['goodClass']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
              <a-button type="primary" icon="search" style="margin-left:10px" @click="searchQuery">查询</a-button>
              <a-button style="margin-left: 8px" type="primary" icon="reload" @click="searchReset">重置</a-button>
              <a-button type="default" icon="reload" style="margin-left: 8px" @click="refresh" :loading="loading">刷新</a-button>
              <a-button type='primary' ghost icon="shopping-cart" style="margin-left: 8px" @click="createOrder">购买</a-button>
            </a-col>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="mallProductId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >

      <span slot="pic" slot-scope="text">
        <img class='img' alt="" :src="imgUrl+text" />
      </span>

      <span slot="state" slot-scope="text">
        <a-tag color="brown" v-if="text === '0' ">待审核</a-tag>
          <a-tag color="blue" v-else-if="text === '1' ">已通过</a-tag>
          <a-tag color="red" v-else-if="text === '2' ">已拒绝</a-tag>
          <a-tag color="green" v-else-if="text === '3' ">已上架</a-tag>
          <a-tag color="Thistle" v-else>已下架</a-tag>
      </span>

      <span slot="action" slot-scope="text, record">
        <a-button @click="handleEdit(record)" type="primary" icon="edit" >编辑</a-button>&nbsp;
        <a-button v-if="record.state=== '0' " @click="checkGood(record)" type="primary" icon="check" >审核&nbsp;</a-button>
        <a-button v-if="record.state=== '4' || record.state === '1' " @click="upOrDown(record.mallProductId,'3')" icon="rise" >上架&nbsp;</a-button>
        <a-button v-if="record.state=== '3' " @click="upOrDown(record.mallProductId,'4')" type="dashed" icon="fall" >下架</a-button>&nbsp;
        <a-button type="danger" @click="handleDelete(record.mallProductId)" ghost icon="delete">删除</a-button>
      </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- form表单 -->
    <Dialog-Edit ref="dialogEdit" @ok="modalFormOk"></Dialog-Edit>
    

    <dialog-create-order
      :key="dialogCreateOrderKey"
      :visible.sync="dialogCreateOrderVisible"
      @submitted="createPay($event)"
    ></dialog-create-order>

  </a-card>
</template>

<script>
import DialogEdit from './modules/dialogProductEdit'
import Vue from 'vue'
import { page,delete_,updateGood } from '@/api/mall/mallProduct'
import { classList } from '@/api/mall/mallProductCategory'
import dialogCreateOrder from './modules/dialogCreateOrder'

const columns = [
  {
    title: '#',
    dataIndex: '',
    key: 'rowIndex',
    width: 60,
    align: 'center',
    customRender: function(t, r, index) {
      return parseInt(index) + 1
    }
  },
  {
    title: '商品名称',
    align: 'center',
    dataIndex: 'name',
    width: 200
  },
  {
    title: '图片',
    align: 'center',
    dataIndex: 'pic',
    scopedSlots: { customRender: 'pic' },
    width: 150
  },
  {
    title: '价格',
    dataIndex: 'price',
    align: 'center',
    width: 120
  },
  {
    title: '销量',
    dataIndex: 'sale',
    align: 'center',
    width: 100
  },
  {
    title: '库存',
    align: 'center',
    dataIndex: 'stock',
    width: 100
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
    align: 'center',
    scopedSlots: { customRender: 'action' },
    width: 400
  }
]

export default {
  name: 'mallProductList_view',
  components: {
    DialogEdit,
    dialogCreateOrder,
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      screenForm: this.$form.createForm(this),
      columns: columns,
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      dialogCreateOrderKey: 0,
      dialogCreateOrderVisible: false,
      imgUrl: process.env.VUE_APP_IMG,
      classOptions: [],
    }
  },
  mounted() {
    this.loadData()
    this.initGoodClass()
  },
  methods: {
    // 初始化数据
    async loadData() {
      let that = this
      let screenData = this.screenForm.getFieldsValue()
      if(screenData.goodClass){
        screenData.mallProductClassId = screenData.goodClass[1]
        delete screenData.goodClass
      }
      let obj = {
        current: that.ipagination.current,
        size: that.ipagination.pageSize,
        ...screenData
      }
      this.loading = true
      await page(obj).then(res => {
        if (res.code === 200) {
          this.dataSource = res.data
          that.ipagination.total = res.page.total
        }
        this.loading = false
      })
    },
    // 初始化商品类目
    async initGoodClass() {
      let { code, data } = await classList();
        if (code === 200) {
          this.classOptions = this.handleClassTreeData(data);
        } else {
          this.$message.warn('未获取到相关行政区域数据！');
        }
    },
    // 处理商品类目
    handleClassTreeData(tree) {
      for (let node of tree) {
        node.label = node.name
        node.value = node.mallProductClassId
        node.scopedSlots = {
          icon: 'icon',
          title: 'title'
        }
        if (node.children) node.children = this.handleClassTreeData(node.children)
      }
      return tree
    },
    // 表单查询
    searchQuery(e) {
      e.preventDefault()
      this.ipagination.current = 1
      this.loadData()
    },
    // 表单重置
    searchReset() {
      this.screenForm.resetFields()
      this.ipagination.current = 1
      this.loadData()
    },
    // 新增
    handleAdd: function() {
      this.$refs.dialogEdit.add()
      this.$refs.dialogEdit.title = '新增'
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData()
    },
    // 新增/修改 成功时，重载列表
    modalFormOk() {
      this.loadData()
    },
    // 编辑
    handleEdit: function(record) {
      this.$refs.dialogEdit.edit(record)
      this.$refs.dialogEdit.title = '编辑'
      this.$refs.dialogEdit.disableSubmit = false
    },
    // 审核
    checkGood: function(record) {
      this.$refs.dialogEdit.edit(record)
      this.$refs.dialogEdit.title = '审核'
      this.$refs.dialogEdit.checkFlag = true
      this.$refs.dialogEdit.disableSubmit = false
    },
    // 删除
    handleDelete: function(id) {
      var that = this
      that.$confirm({
        title: '确认删除',
        content: '是否删除当前数据?',
        onOk: function() {
          delete_({ mallProductId: id }).then(res => {
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
    // 刷新
    refresh() {
      this.loading = true
      this.loadData()
    },
    // 购买
    createOrder() {
      this.dialogCreateOrderVisible = true;
      this.dialogCreateOrderKey++;
    },
    // 结算
    createPay(data) {
     this.$router.push({
        name: 'imall-pay',
        params:{payAmount:data.payAmount,shipping:data.shipping,orderNo:data.orderNo,sysUserId:data.sysUserId}
      })
    },
    // 上下架
    upOrDown(mallProductId, state) {
      let msg = '上架'
      if (state === '4') {
        msg = '下架'
      }
      let _this = this
      _this.$confirm({
        title: '提示',
        content: '您确定要' + msg + '此商品吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          let obj = {
            mallProductId,
            state
          }
          updateGood(obj).then(resp => {
            if (resp.code === 200) {
              _this.$message.success('操作成功!')
              _this.loadData()
            } else {
              _this.$message.error(resp.msg || '操作失败!')
            }
          })
        },
      })
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.img {
    flex: none;
    width: 60px;
    height: 60px;
  }
</style>