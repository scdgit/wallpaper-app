<template>
   <view class="box">
      <image class="image grad-animation" :src="src" :mode="mode" :lazy-load="lazyLoad"/>
      <view class="mask" :style="{backgroundImage: `url(${src})`}" />
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
</script>

<style scoped lang="scss">
.box {
   width: 100%;
   height: 100%;
   // background-size: 100% auto;
   background-color: skyblue;
   background-repeat: repeat-y;
   position: relative;
   .image {
      width: 100%;
      // display: none;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      z-index: 2;
   }
   .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
      filter: blur(6px); /* 设置模糊效果的程度，可以根据需要调整 */
   }
}
</style>