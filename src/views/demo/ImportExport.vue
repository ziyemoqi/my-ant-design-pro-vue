<template>
<a-card :bordered="false" class="card-area">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
        <a-row :gutter="24">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button
                @click="exportWord"
                type="primary"
                icon="download"
                :loading="exporting"
                style="margin-left: 8px"
              >导出word</a-button>
            </a-col>
          </span>
        </a-row>
    </div>

  </a-card>
</template>

<script>
import Vue from 'vue'
import download from '@/utils/download'

export default {
  name: 'ImportExport_view',
  data() {
    return {
      exporting: false
    }
  },
  mounted() {
  },
  methods: {
    // 导出word
    async exportWord() {
      this.exporting = true
      await download(
        '/demo/export/exportWord',
        false,
        false
      )
      this.exporting = false
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>