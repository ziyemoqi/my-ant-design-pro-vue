<template>
  <div class="sub-title fix">
    <p class="title l">{{title}}</p>
    <p class="title-info l">{{description}}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SubTitle',

  props: {
    title: String,
    description: String
  }
}
</script>

<style lang="scss" scoped>
.sub-title {
  width: 100%;
  border-bottom: 1px solid #dcdfe5;
  line-height: 36px;
  .title {
    margin: 0;
    font-size: 16px;
    color: #666;
    border-bottom: 2px solid blue($color: #1890ff);
  }
  .title-info {
    margin: 0 0 0 22px;
    font-size: 12px;
    color: #999;
  }
}
</style>
