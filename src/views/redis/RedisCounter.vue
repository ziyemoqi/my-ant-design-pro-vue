<template>
  <a-card :bordered="false" class="card-area">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline">
        <a-row :gutter="24">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button icon="plus" @click="importDevice" style="margin-left: 8px">导入设备实现序列号自增</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>
  </a-card>
</template>

<script>
import Vue from 'vue'
import { importDevice } from '@/api/redis'


export default {
  name: 'RedisCounter_view',

  data() {
    return {
      loading: false,
    }
  },
  methods: {
    // 刷新
    refresh() {
      this.loading = true
    },
    // 导入设备实现序列号自增
    importDevice() {
      var that = this
      that.$confirm({
        title: '确认',
        content: '确认导入设备?',
        onOk: function() {
          importDevice().then(res => {
            if (res.code === 200) {
              let msg = res.data
              that.$message.success(msg)
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
<style scoped>
@import '~@assets/less/common.less';
</style>