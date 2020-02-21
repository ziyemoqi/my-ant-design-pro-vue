<template>
  <a-card :bordered="false" class="card-area">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" >
        <a-row :gutter="24">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button
                @click="refresh"
                type="default"
                icon="reload"
                :loading="loading"
              >刷新</a-button>
              <a-button icon="reload" @click="initData" style="margin-left: 8px">初始化数据</a-button>
              <a-button icon="reload" @click="clearData" style="margin-left: 8px">清除数据</a-button>
              <a-button type="primary" icon="search" @click="searchScore('1')" style="margin-left: 8px">排行榜TOP10</a-button>
              <a-button icon="plus" @click="rankAdd" style="margin-left: 8px">新增</a-button>
              <a-button icon="plus" @click="addScore" style="margin-left: 8px">乔治_1加10分</a-button>
              <a-button icon="search" @click="userInfo" style="margin-left: 8px">查询乔治_1的排名和分数</a-button>
              <a-button icon="search" @click="scopeCount" style="margin-left: 8px">统计分数区间人数</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="redisRankId"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
      ></a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import Vue from 'vue'
import { getData,clearData, initRankData, scoreTop10, rankAdd, userInfo, scopeCount, addScore } from '@/api/redis'

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
    title: '姓名',
    align: 'center',
    dataIndex: 'name',
    width: 200
  },
  {
    title: '成绩',
    align: 'center',
    dataIndex: 'score',
    width: 200
  }
]

export default {
  name: 'RedisRank_view',

  data() {
    return {
      dataSource: [],
      loading: false,
      columns: columns
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData(screenData) {
      let that = this
      this.loading = true
      await getData().then(res => {
        if (res.code === 200 && res.data) {
          let dataSource = res.data
          for (let node of dataSource) {
            node.name = node.value
            node.redisRankId = node.value
          }
          this.dataSource = res.data
        }else {
           this.dataSource = []
        }
        this.loading = false
      })
    },
    // 总成绩排名
    searchScore(type) {
      let that = this
      that.loading = false
      scoreTop10({ type: type }).then(res => {
        if (res.code === 200) {
          if (res.data) {
            let dataSource = res.data
            if (type === '1') {
              for (let node of dataSource) {
                node.name = node.value
                node.redisRankId = node.value
              }
            }else if (type === '2'){
              for (let node of dataSource) {
                node.name = node.value
                node.chineseScore = node.score
                node.redisRankId = node.value
                node.score = ''
              }
            }else {
              for (let node of dataSource) {
                node.name = node.value
                node.mathScore = node.score
                node.redisRankId = node.value
                node.score = ''
              }
            }
            that.dataSource = res.data
            that.$message.success('成功获取榜单前10名！')
          } else {
            that.$message.warning('暂无数据，请尝试初始化数据！')
            that.dataSource = []
          }
        }
        that.loading = false
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      this.loadData()
    },
    //初始化数据
    initData() {
      var that = this
      that.$confirm({
        title: '确认',
        content: '确认初始化排行榜数据?',
        onOk: function() {
          initRankData().then(res => {
            if (res.code === 200) {
              that.$message.success('操作成功，已生成200条初始数据！')
              that.loadData()
            } else {
              that.$message.warning(res.msg || '操作失败!')
            }
          })
        }
      })
    },
    // 清除数据
    clearData() {
      var that = this
      that.$confirm({
        title: '确认',
        content: '确认清除排行榜数据?',
        onOk: function() {
          clearData().then(res => {
            if (res.code === 200) {
              that.$message.success('操作成功，已清除缓存！')
              that.loadData()
            } else {
              that.$message.warning(res.msg || '操作失败!')
            }
          })
        }
      })
    },
    // 新增某人的分数到排行榜中
    rankAdd() {
      var that = this
      rankAdd().then(res => {
        if (res.code === 200) {
          that.$message.success('操作成功,成绩榜单中新增一名学生信息！')
          that.loadData()
        } else {
          that.$message.warning(res.msg || '操作失败!')
        }
      })
    },
    // 获取指定人的分数到排行榜中
    userInfo() {
      var that = this
      userInfo().then(res => {
        if (res.code === 200) {
          let score = res.data.score
          let num = res.data.rankNum
          that.$message.success('乔治_1的成绩是' + score + ',排名是' + num)
        } else {
          that.$message.warning(res.msg || '操作失败!')
        }
      })
    },
    // 统计分数区间人数
    scopeCount() {
      var that = this
      scopeCount().then(res => {
        if (res.code === 200) {
          let count = res.data
          that.$message.success('成绩排行榜50~80区间人数为' + count)
        } else {
          that.$message.warning(res.msg || '操作失败!')
        }
      })
    },
    // 乔治_1加分500
    addScore() {
      var that = this
      addScore().then(res => {
        if (res.code === 200) {
          that.$message.success('操作成功！')
          that.loadData()
        } else {
          that.$message.warning(res.msg || '操作失败!')
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>