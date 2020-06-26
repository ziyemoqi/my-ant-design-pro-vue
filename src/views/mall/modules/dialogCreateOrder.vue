<template>
  <a-modal
    title="购买信息"
    :visible="visible"
    :width="1350"
    :confirmLoading="submitting"
    okText="去结算"
    cancelText="取消"
    @ok="handleSubmit"
    @cancel="$emit('update:visible', false)"
  >
    <div class="wrap-cards">
      <div class="form-card" style="padding: 20px">
      <sub-title title="商品信息" />
      <div style="margin:15px 0px">
        <form>
          <a-table
            :columns="columns_"
            :dataSource="tableData"
            :pagination="false"
          >
          <template v-for="(col, i) in ['goodName', 'goodPic', 'goodPrice','goodNum']" :slot="col" slot-scope="text, record">
            <div :key="col" v-if="col === 'goodName' ">
              <a-input
                :key="col"
                v-if="record.editable"
                :readOnly="true"
                :value="text"
                :placeholder="columns_[i].title"
                @click="selectGood(record.key)"
              />
            <template v-else>{{ text }}</template>
            </div>
            <div :key="col" v-if="col === 'goodPic'">
                 <img v-if="record.editable" class='img' alt="" :src="imgUrl+text" />
              <template v-else><img class='img' alt="" :src="imgUrl+text" /></template>
              </div>
            <div :key="col" v-if="col === 'goodPrice'">
                <a-input
                  :key="col"
                  v-if="record.editable"
                  :disabled="true"
                  :value="text"
                  :placeholder="columns_[i].title"
                />
              <template v-else>{{ text }}</template>
              </div>
            <div :key="col" v-if="col==='goodNum'">
              <a-input-number
                :key="col"
                v-if="record.editable"
                style="width:100%"
                :value="text"
                :placeholder="columns_[i].title"
                @change="e => handleChange(e, record.key, col)"
              />
              <template v-else>{{ text }}</template>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <a>移除</a>
                </a-popconfirm>
              </span>
            </template>
          </template>
        </a-table>
        <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newGood">选购商品</a-button>
      </form>
    </div>
    <a-form :form="form">
      <sub-title title="支付信息" />
      <a-row :gutter="24">
        <a-col :span="12" style="padding-left: 2px; padding-right: 2px;">
          <div class="form-box">
            <a-form-item label="订单金额" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input :disabled="true" v-decorator="['totalAmount']" />
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="form-box">
            <a-form-item label="支付金额" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
              <a-input :disabled="true" v-decorator="['payAmount']" />
            </a-form-item>
          </div>
        </a-col>
      </a-row>
      <sub-title title="收货信息" />
      <a-row :gutter="24">
        <a-col :span="12">
          <div class="form-box">
            <a-form-item label="收获地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                style="width: 100%"
                placeholder="请选择收货地址"
                optionFilterProp="children"
                v-decorator="['mallShippingId',{ rules: [{required: true, message: '请请选择收货地址'}]}]"
              >
                <a-select-option
                  v-for="(shipping,roleindex) in shippingList"
                  :key="roleindex.toString()"
                  :value="shipping.mallShippingId"
                >{{ shipping.receiverAddress }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-col>
      </a-row>
    </a-form>
    </div>
    </div>
    <template>
      <a-modal title="选择商品" v-model="selectGoodVisible" @ok="handleOk" :width="800" destroyOnClose>
            <a-form layout="inline" :form="goodScreenForm" @submit.prevent="handleScreenSubmit">
              <div class="base-content">
                <a-form-item label="商品名称">
                  <a-input v-decorator="['name',{}]" placeholder="请输入..."></a-input>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" html-type="submit" style="margin-left: 18px">查询</a-button>
                  <a-button @click="handleReset" style="margin-left: 8px">重置</a-button>
                </a-form-item>
              </div>
            </a-form>
            <div class="page-wrapper">
              <a-table
                :rowSelection="rowSelection"
                :columns="columns"
                :dataSource="goodData"
                :pagination="pagination"
                @change="handleTableChangeAdd"
                :rowKey="record => record.mallProductId"
              >
               <span slot="pic" slot-scope="text">
                  <img class='img' alt="" :src="imgUrl+text" />
                </span>
              </a-table>
            </div>
          </a-modal>
    </template>
  </a-modal>
</template>

<script>
import * as good from '@/api/mall/mallProduct'
import * as order from '@/api/mall/mallOrder'
import {shipingList} from '@/api/mall/shipping'
import * as region from '@/api/region';
import SubTitle from '@/components/basis/SubTItle'

const columns = [{
    title: '商品名称',
    width: '25%',
    dataIndex: 'name'
  },
  {
    title: '商品图片',
    dataIndex: 'pic',
    width: '20%',
    scopedSlots: { customRender: 'pic' }
  },
  {
    title: '单价',
    width: '15%',
    dataIndex: 'price',
  },
  {
    title: '销量',
    width: '15%',
    dataIndex: 'sale',
  },
  {
    title: '库存',
    width: '15%',
    dataIndex: 'stock',
  },
];

const columns_ = [{
    title: '商品名称',
    dataIndex: 'goodName',
    key: 'goodName',
    width: '25%',
    scopedSlots: { customRender: 'goodName' }
  },
  {
    title: '商品图片',
    dataIndex: 'goodPic',
    key: 'goodPic',
    align: 'center',
    width: '25%',
    scopedSlots: { customRender: 'goodPic' }
  },
  {
    title: '售价',
    dataIndex: 'goodPrice',
    key: 'goodPrice',
    width: '20%',
    scopedSlots: { customRender: 'goodPrice' }
  },
  {
    title: '购买数量',
    dataIndex: 'goodNum',
    key: 'goodNum',
    width: '20%',
    scopedSlots: { customRender: 'goodNum' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'operation' }
  }];
export default {
  name: 'dialogCreateOrder',
  components: {
    SubTitle
  },
  data() {
    let form = this.$form.createForm(this);
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      submitting: false,
      form,
      goodScreenForm: this.$form.createForm(this),
      selectGoodVisible: false,
      selectedGoodRowKeys: [],
      columns,
      goodList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        size: 'small',
        showTotal: total => `共 ${total} 条`
      },
      goodData: [],
      areaOptions: [],
      columns_,
      tableData: [],
      newKey: '0',
      chooseKey: '0',
      shippingList: [],
      imgUrl: process.env.VUE_APP_IMG,
    };
  },

  props: {
    visible: Boolean,
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedGoodRowKeys, selectedRows) => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedGoodRowKeys = selectedRows;
        }
      };
    }
  },
  mounted() {
    this.area();
    this.initialShippingList()
  },
  methods: {
    // 添加商品
    newGood () {
      this.tableData.push({
        key: this.newKey,
        goodName: '',
        goodPic: '',
        goodPrice: '',
        goodNum: '1',
        editable: true,
        isNew: true,
        goodId: ''
      })
      this.newKey ++
    },
    // 删除此行商品
    remove (key) {
      const newData = this.tableData.filter(item => item.key !== key)
      this.tableData = newData
      let totalAmount = 0
      newData.forEach(element => {
        totalAmount = totalAmount + ((element.goodNum) * (element.goodPrice))
      });
      this.form.setFieldsValue({"totalAmount":totalAmount,"payAmount": totalAmount})
    },
    toggle (key) {
      let target = this.tableData.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    cancel (key) {
      let target = this.tableData.filter(item => item.key === key)[0]
      target.editable = false
    },
    handleChange (value, key, column) {
      const newData = [...this.tableData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.tableData = newData
      }
      let totalAmount = 0
      newData.forEach(element => {
        totalAmount = totalAmount + ((element.goodNum) * (element.goodPrice))
      });
      this.form.setFieldsValue({"totalAmount":totalAmount,"payAmount": totalAmount})
    },
    // 点击选择商品
    selectGood(value) {
      this.selectGoodVisible = true
      this.selectedGoodRowKeys.length = 0;
      this.chooseKey = value
      this.getGoodList();
    },
    // 查询商品列表
    async getGoodList() {
      this.goodData = [];
      let screenForm = this.goodScreenForm.getFieldsValue()
      let { current, pageSize } = this.pagination;
      let obj = {
        current: current,
        size: pageSize,
        stockFlag: '1',
        ...screenForm,
        state: 3
      };
      let { code, msg, data, page } = await good.page({...obj});
      if (code === 200) {
        this.goodData = data;
        this.pagination.total = page.total;
      } else {
        this.$message.error(msg || '数据获取失败');
      }
    },
    // 翻页
    handleTableChangeAdd({ current }) {
      this.pagination.current = current;
      this.getGoodList();
    },
    // 选择商品完毕
    handleOk(e) {
      if (this.selectedGoodRowKeys.length > 1) {
        this.$message.error('只能选择一个商品');
        return false;
      }
      this.selectGoodVisible = false
      const newData = [...this.tableData]
      const target = newData.filter(item => this.chooseKey === item.key)[0]
      if (target) {
        target['goodId'] = this.selectedGoodRowKeys.map(x => (x = x.mallProductId))[0]
        target['goodName'] = this.selectedGoodRowKeys.map(x => (x = x.name))[0]
        target['goodPic'] = this.selectedGoodRowKeys.map(x => (x = x.pic))[0]
        target['goodPrice'] = this.selectedGoodRowKeys.map(x => (x = x.price))[0]
        this.tableData = newData
      }
      let totalAmount = 0
      newData.forEach(element => {
        totalAmount = totalAmount + ((element.goodNum) * (element.goodPrice))
      });
      this.form.setFieldsValue({"totalAmount":totalAmount,"payAmount": totalAmount})
    },
    // 查询商品
    handleScreenSubmit(e) {
      e.preventDefault();
      this.pagination.current = 1;
      this.getGoodList();
    },
    // 重置
    handleReset() {
      this.goodScreenForm.resetFields();
      this.getGoodList();
    },
    // 获取行政区域
    async area() {
      let { code, data } = await region.regionList();
      if (code === 200) {
        this.areaOptions = this.handleAreaTreeData(data);
      } else {
        this.$message.warn('未获取到相关行政区域数据！');
      }
    },
    // 处理行政区域数据
    handleAreaTreeData(tree) {
      for (let node of tree) {
        node.label = node.title
        node.value = node.key
        node.scopedSlots = {
          icon: 'icon',
          title: 'title'
        }
        if (node.children) node.children = this.handleAreaTreeData(node.children)
      }
      return tree
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (err) return;
          this.createOrder({...values});
      });
    },
    async createOrder(values) {
      try {
        this.submitting = true
        let goodsInfo = this.tableData
        let obj = { ...values,goodsInfo };
        let { code, data, msg } = await order.createOrder(obj);
        if (code !== 200) throw new Error(msg || '结算失败');
        this.$emit('update:visible', false);
        this.$emit('submitted',data);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.submitting = false;
      }
    },
    // 初始化收货地址
    initialShippingList () {
      shipingList().then(res => {
        if (res.code === 200) {
          this.shippingList = res.data
        } else {
          console.log(res.msg)
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 24px;
}
.wrap-cards {
  height: 100%;
}
.tree-card {
  min-width: 250px;
  min-height: 100%;
  user-select: none;
  margin-right: 20px;
  background-color: #fff;
}

.form-box {
  padding: 28px 0 40px;
  .form-info {
    margin-bottom: 0;
    font-size: 12px;
    color: #999;
  }
  .avatar-uploader {
    /deep/ .ant-upload {
      font-size: 16px;
      .ant-upload-select-picture-card {
        width: 110px;
        height: 110px;
      }
    }
  }
}
.btns {
  /deep/ .ant-btn {
    margin-right: 10px;
  }
}
.form-card {
  flex: 1;
  min-height: 100%;
  background-color: #fff;
  padding-top: 0 !important;
}
.img {
  flex: none;
  width: 60px;
  height: 60px;
}
</style>
