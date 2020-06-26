<template>
  <a-modal
    :title="title"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top:15%;height: 70%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="名称">
          <a-input placeholder="请输入..." v-decorator="['title', {
            rules: [{required: true, message: '请填写名称'}]
          }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品">
          <a-input
              :readOnly="true"
              v-decorator="['mallProductName',{}]"
              placeholder="请选择..."
              @click="selectGood()"
            />
        </a-form-item>

        <a-form-item label="秒杀时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-range-picker
            v-decorator="['dateRange',{ rules: [{required: true, message: '请输入...'}] }]"
            :showTime="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm:ss"
            style="width:100%"
          />
        </a-form-item>

        <a-form-item label="库存" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="1" v-decorator="['stock', { rules: [{required: true, message: '请输入...'}] }]" style="width:100%"  placeholder="请输入..." />
        </a-form-item>

      </a-form>
    </a-spin>
    <template>
      <a-modal title="选择商品" v-model="selectGoodVisible" @ok="goodChooseHandleOk" :width="800" destroyOnClose>
            <a-form layout="inline" :form="goodScreenForm" @submit.prevent="handleScreenSubmit">
              <div class="base-content">
                <a-form-item label="商品名称">
                  <a-input v-decorator="['goodName',{}]" placeholder="请输入..."></a-input>
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
import pick from 'lodash.pick'
import moment from 'moment'
import {save} from '@/api/mall/mallSeckill'
import * as good from '@/api/mall/mallProduct'

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

  export default {
    name: "dialogEdit",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        moment,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        uploading: false,
        selectGoodVisible: false,
        selectedGoodRowKeys: [],
        chooseKey: '0',
        goodScreenForm: this.$form.createForm(this),
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
        imgUrl: process.env.VUE_APP_IMG,
        mallProductId: ''
      }
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
    
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.confirmLoading = false
        this.form.resetFields()
        this.visible = true
        let dateRange
        if (record.seckillStartTime && record.seckillEndTime) {
          dateRange = [moment(record.seckillStartTime), moment(record.seckillEndTime)]
        }
        this.mallProductId = record.mallProductId
        this.model = Object.assign({}, record)
        let obj = {
          ...this.model,
          dateRange,
        };
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(obj,'mallProductName','title','stock','dateRange'))
        });
      },
      close () {
        this.$emit('close')
        this.visible = false
      },
      // 点击选择商品
      selectGood() {
        this.selectGoodVisible = true
        this.selectedGoodRowKeys.length = 0;
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
    goodChooseHandleOk(e) {
      if (this.selectedGoodRowKeys.length > 1) {
        this.$message.error('只能选择一个商品');
        return false;
      }
      this.selectGoodVisible = false
      this.form.setFieldsValue({"mallProductName":this.selectedGoodRowKeys[0].name})
      this.mallProductId = this.selectedGoodRowKeys[0].mallProductId
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
    // 提交操作
    handleOk () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let formData = Object.assign(this.model, values)
          formData['mallProductId'] = this.mallProductId
          formData['seckillStartTime'] = formData.dateRange[0].format('YYYY-MM-DD HH:mm:ss')
          formData['seckillEndTime'] = formData.dateRange[1].format('YYYY-MM-DD HH:mm:ss')
          delete formData.dateRange
          let obj = save(formData).then((res)=>{
            if(res.code === 200){
              that.$message.success('操作成功!');
              that.$emit('ok');
            }else{
              that.$message.warning(res.msg ||'操作失败!');
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })
        }
      })
    },
    handleCancel () {
      this.close()
    },
    }
  }
</script>


<style lang="scss" scoped>
.img {
  flex: none;
  width: 60px;
  height: 60px;
}
</style>