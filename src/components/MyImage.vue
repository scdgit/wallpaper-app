<template>
  <view class="box">
    <image class="image" :src="src" :mode="mode" :lazy-load="lazyLoad" @load="onLoad"/>
  </view>
</template>

<script setup lang="ts">
/* 图片缓存组件，解决分包中显示图片每次都重新加载 */
defineProps({
  src: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: ''
  },
  lazyLoad: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['load'])
// 图片加载完毕
const onLoad = (e: Event) => {
  emits('load', e)
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  .image {
    width: 100%;
  }
}
</style>