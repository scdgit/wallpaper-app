<template>
   <view class="video-container">
      <video :autoplay="autoplay" :muted="muted" :loop="loop" :controls="controls" :src="video.url" class="video"/>
      <view class="mask" :style="{backgroundImage: `url(${video.img})`}" />
   </view>
</template>

<script lang="ts" setup>
const props = defineProps({
   autoplay: {
      type: Boolean,
      default: true
   },
   muted: { // 是否静音播放
      type: Boolean,
      default: true
   },
   loop: { // 是否循环播放
      type: Boolean,
      default: true
   },
   controls: { // 是否显示控件
      type: Boolean,
      default: false
   },
   video: {
      type: Object,
      default: null
   }
})
console.log(props.video)

</script>

<style scoped lang="scss">
.video-container {
   width: 100%;
   height: 100%;
   background-color: skyblue;
   background-repeat: repeat-y;
   position: relative;
   .video {
      width: 96%;
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