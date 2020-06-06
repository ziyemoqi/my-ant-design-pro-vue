<template>
  <div class="base-img">
    <img
      :src="imgSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :onerror="handleDefaultImg"
    />
  </div>
</template>

<script>
export default {
  name: 'base-img',
  props: {
    // 单个图片路径
    src: String,
    // 配置图片原生属性-alt
    alt: {
      type: String,
      default: 'Img'
    },
    // 配置图片原生属性-宽度
    width: {
      type: String,
      default: '200'
    },
    // 配置图片原生属性-高度
    height: {
      type: String,
      default: ''
    }
  },

  computed: {
    imgSrc () {
      return this.src.indexOf('data:image/jpg;base64') >= 0 || this.src.indexOf('http') >= 0 ? this.src : `${this.baseUrl}${this.src}`
    }
  },

  data () {
    return {
      baseUrl: process.env.VUE_APP_IMG
    }
  },
  methods: {
    handleDefaultImg () {
      return `this.src="${require('../assets/icons/svg/img-default.svg')}"`
    }
  }
}
</script>

<style lang="less" scoped>
.base-img {
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
