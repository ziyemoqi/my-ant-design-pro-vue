<template>
  <div class="page-header-index-wide">
    <!--  -->
    sfjaiofjasdio
  </div>
</template>

<script>
  // import ChartCard from '@/components/ChartCard'
  // import ACol from "ant-design-vue/es/grid/Col"
  // import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  // import MiniArea from '@/components/chart/MiniArea'
  // import MiniBar from '@/components/chart/MiniBar'
  // import MiniProgress from '@/components/chart/MiniProgress'
  // import RankList from '@/components/chart/RankList'
  // import Bar from '@/components/chart/Bar'
  // import Trend from '@/components/Trend'
  // import {getLoginfo} from '@/api/api'

  const rankList = []
  for (let i = 0; i < 7; i++) {
    rankList.push({
      name: '白鹭岛 ' + (i+1) + ' 号店',
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
    name: "Analysis",
    components: {
      // ATooltip,
      // ACol,
      // ChartCard,
      // MiniArea,
      // MiniBar,
      // MiniProgress,
      // RankList,
      // Bar,
      // Trend
    },
    data() {
      return {
        loading: true,
        center: null,
        rankList,
        barData,
        loginfo:{},
      }
    },
    created() {
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
      this.initLogInfo();
    },
    methods: {
      initLogInfo () {
        getLoginfo(null).then((res)=>{
          if(res.success){
            this.loginfo = res.result;
          }
        })
      },
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
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
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