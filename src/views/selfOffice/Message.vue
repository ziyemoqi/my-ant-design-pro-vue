<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="screenForm" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
             <a-form-item label="标题" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="请输入..." v-decorator="['title']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="default" icon="reload" style="margin-left: 8px" @click="refresh" :loading="loading">刷新</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" v-if="record.readState == 0"/>
          <a v-if="record.readState == 0" @click="handleEdit(record)">标注已读</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <dialog-message ref="dialogEdit" @ok="modalFormOk"></dialog-message>
  </a-card>
</template>

<script>
import dialogMessage from './modules/dialogMessage'
import {page,readMessage} from '@/api/selfOffice/message'
// 表头
const columns = [
  {
    title: '#',
    dataIndex: '',
    key: 'rowIndex',
    width: 60,
    align: "center",
    customRender: function (t, r, index) {
      return parseInt(index) + 1;
    }
  },
  {
    title: '标题',
    align: "center",
    dataIndex: 'title'
  },
  {
    title: '消息类型',
    align: "center",
    dataIndex: 'type',
    customRender: function (text) {
      if (text == 0) {
        return "通知公告";
      } else if (text == 1) {
        return "系统消息";
      } else {
        return text;
      }
    }
  },
  {
    title: '发布人',
    align: "center",
    dataIndex: 'createUser'
  },
  {
    title: '优先级',
    align: "center",
    dataIndex: 'level',
    customRender: function (text) {
      if (text == 0) {
        return "低";
      } else if (text == 1) {
        return "中";
      } else if (text == 2) {
        return "高";
      } else {
        return text;
      }
    }
  },
  {
    title: '发布时间',
    align: "center",
    dataIndex: 'sendTime'
  },
  {
    title: '阅读状态',
    align: "center",
    dataIndex: 'readState',
    customRender: function (text) {
      if (text == 0) {
        return "未读";
      } else if (text == 1) {
        return "已读";
      } else {
        return text;
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: "center",
    scopedSlots: {customRender: 'action'},
  }
]
  export default {
    name: "MessageList",
    components: {
      dialogMessage
    },
    data() {
      return {
        columns: columns,
        screenForm: this.$form.createForm(this),
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
        dataSource:[],
        loading: false,
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      // 初始化数据
      async loadData() {
        let that = this
        let screenData = this.screenForm.getFieldsValue()
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
          } else {
            that.$message.warning(res.msg || '操作失败!')
          }
          this.loading = false
        })
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
      // 刷新
      refresh() {
        this.screenForm.resetFields()
        this.ipagination.current = 1
        this.loading = true
        this.loadData()
      },
      // 标注已读
      handleEdit(record) {
        let that = this
        let message = {
          messageReceiveId: record.id
        }
        readMessage({...message}).then((res)=>{
            if(res.code === 200){
              that.$message.success('操作成功!');
            }else{
              that.$message.warning(res.msg ||'操作失败!');
            }
          }).finally(() => {
            this.loadData()
          })
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
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>