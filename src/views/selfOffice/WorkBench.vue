<template>
  <div class="card-list" ref="content">
    <div style="margin:0px 0px 10px 0px;">
      <a-card :bordered="false">
      <a-row>
        <a-col :sm="24" :xs="24">
          <span style="font-size:17px">{{description}}</span>
        </a-col>
      </a-row>
    </a-card>
    </div>
    <a-list
      rowKey="id"
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="dataSource"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <template v-if="!item || item.workBenchId === undefined">
          <a-button class="new-btn" type="dashed" @click="addWork">
            <a-icon type="plus"/>
            新增功能
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <a-card-meta>
              <a slot="title">{{ item.title }}</a>
              <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large"/>
              <div class="meta-content" slot="description" >
                <a-popover :title="item.title">
                  <template slot="content">
                    <p>{{ item.content }}</p>
                  </template>
                  {{ item.content }}
                </a-popover>
              </div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a @click="update(item)">修改</a>
              <a @click="delete_(item.workBenchId)">删除</a>
            </template>
          </a-card>
        </template>
      </a-list-item>
    </a-list>

    <Dialog-Info ref="dialog" @ok="modalFormOk"/>
  </div>
</template>

<script>
import { list, delete_ } from '@/api/selfOffice/workBench'
import DialogInfo from './modules/dialogWorkBench'


export default {
  name: 'WorkBench',
  components: {
    DialogInfo
  },
  data () {
    return {
      description: '功能描述：简要记录本平台技术要点 ',
      dataSource: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      let that = this
      let { code, data, msg } = await list()
      if (code === 200) {
        that.dataSource = []
        that.dataSource.push({})
        data.forEach(element => {
          that.dataSource.push({
            workBenchId: element.workBenchId,
            title: element.title,
            avatar: element.avatar,
            content: element.content,
            sort: element.sort
          })
        });
      } else {
        that.$message.error(msg || '数据获取失败,请联系系统管理员')
      }
    },
    addWork (){
      this.$refs.dialog.add()
      this.$refs.dialog.title = '新增'
    },
    // 新增/修改 成功时，重载列表
    modalFormOk() {
      this.loadData()
    },
    update(record) {
      this.$refs.dialog.edit(record)
      this.$refs.dialog.title = '编辑'
    },
    delete_(id) {
      var that = this
      that.$confirm({
        title: '确认删除',
        content: '是否删除当前数据?',
        onOk: function() {
          delete_({ workBenchId: id }).then(res => {
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
  }
}
</script>

<style lang="less" scoped>
  @import "~@/components/index.less";

  .card-list {
    /deep/ .ant-card-body:hover {
      .ant-card-meta-title>a {
        color: @primary-color;
      }
    }

    /deep/ .ant-card-meta-title {
      margin-bottom: 12px;

      &>a {
        display: inline-block;
        max-width: 100%;
        color: rgba(0,0,0,.85);
      }
    }

    /deep/ .meta-content {
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      height: 64px;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;

      margin-bottom: 1em;
    }
  }

  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .ant-card-actions {
    background: #f7f9fa;

    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;
        &:hover {
          color: @primary-color;
        }
      }
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
  }

</style>
