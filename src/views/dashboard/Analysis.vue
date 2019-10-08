<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总销售额" total="￥126,560">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
          </div>
          <template slot="footer">
            日均销售额
            <span>￥ 234.56</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="访问量" :total="8846 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">
            日访问量
            <span>{{ '1234' | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="支付笔数" :total="6560 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar :height="40" />
          </div>
          <template slot="footer">
            转化率
            <span>60%</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="运营活动效果" total="78%">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" :height="8" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs
          default-active-key="1"
          size="large"
          :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}"
        >
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>本周</a>
              <a>本月</a>
              <a>本年</a>
            </div>
            <a-range-picker :style="{width: '256px'}" />
          </div>
          <a-tab-pane loading="true" tab="销售额" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="销售额排行" :dataSource="barData" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="访问量" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="销售额趋势" :dataSource="barData" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <a-row :gutter="12">
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card :loading="loading" :bordered="false" title="实时访问统计" :style="{ marginTop: '24px' }">
          <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
            <a class="ant-dropdown-link" href="#">
              <a-icon type="ellipsis" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;">操作一</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">操作二</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <div style="height: 105px">
            <a-row>
              <a-col :span="8">
                <div class="head-info" :class="center && 'center'">
                  <span>今日IP</span>
                  <p>
                    <a>{{ loginfo.todayIp }}</a>
                  </p>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="head-info" :class="center && 'center'">
                  <span>今日访问</span>
                  <p>
                    <a>{{ loginfo.todayVisitCount }}</a>
                  </p>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="head-info" :class="center && 'center'">
                  <span>访问总览</span>
                  <p>
                    <a>{{ loginfo.totalVisitCount }}</a>
                  </p>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card :loading="loading" :bordered="false" title="销售额类别占比" :style="{ marginTop: '24px' }">
          <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
            <a class="ant-dropdown-link" href="#">
              <a-icon type="ellipsis" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;">操作一</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">操作二</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <p>card content1</p>
          <p>card content2</p>
          <p>card content3</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ChartCard from '@/components/chart/ChartCard'
import ACol from 'ant-design-vue/es/grid/Col'
import ATooltip from 'ant-design-vue/es/tooltip/Tooltip'
import MiniArea from '@/components/chart/MiniArea'
import MiniBar from '@/components/chart/MiniBar'
import MiniProgress from '@/components/chart/MiniProgress'
import RankList from '@/components/chart/RankList'
import Bar from '@/components/chart/Bar'
import Trend from '@/components/Trend'
import { getLoginfo } from '@/api/log'
import * as userApi from '@/api/user'

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}
const barData = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}
export default {
  name: 'Analysis',
  components: {
    ChartCard,
    ACol,
    ATooltip,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend
  },
  data() {
    return {
      loading: true,
      center: null,
      rankList,
      barData,
      loginfo: {},
      num: 0
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.initLogInfo()
    this.timer()
  },
  mounted() {
    //初始化websocket
    this.initWebSocket()
  },
  destroyed: function () { // 离开页面生命周期函数
    this.websocketclose();
  },
  methods: {
    timer () {
     return setInterval(() => {
      this.testWebsocket()
     }, 6000)
    },
    initLogInfo() {
      getLoginfo(null).then(res => {
        if (res.code === 200) {
          this.loginfo = res.data.logInfo
        }
      })
    },
    testWebsocket(){
      // console.log(new Date())
      let params = {
        userId: '99999',
        content: '欢迎来到新的世界！',
        level: '0',
        type: '0',
        modelType: '0',
        rid: '123456'
        };
      userApi.tempApi2(params)
    },
    initWebSocket: function() {
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      var userId = '99999'
      var url =
        window._CONFIG['domianURL'].replace('https://', 'ws://').replace('http://', 'ws://') + '/websocket/' + userId
      this.websock = new WebSocket(url)
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onmessage = this.websocketonmessage
      this.websock.onclose = this.websocketclose
    },
    websocketonopen: function() {
      console.log('WebSocket连接成功')
    },
    websocketonerror: function(e) {
      console.log('WebSocket连接发生错误')
    },
    websocketonmessage: function(e) {
      this.num ++
      var data = eval('(' + e.data + ')')
      // console.log(data)
      this.$notification.success({
        message: '系统消息',
        description:'第'+ this.num+'次推送,'+ data.content
      })
      // console.log(new Date())
    },
    websocketclose: function(e) {
      console.log('connection closed (' + e.code + ')')
    }
  }
}
</script>

<style lang="scss" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    font-size: 0.95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }
  p {
    line-height: 42px;
    margin: 0;
    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}
</style>