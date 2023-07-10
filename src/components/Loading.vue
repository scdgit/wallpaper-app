<template>
   <div class="planet-large" :style="style" />
</template>

<script lang="ts" setup>
const props = defineProps({
   width: {
      type: Number,
      default: 50
   },
   height: {
      type: Number,
      default: 50
   }
})

const style = {
   width: props.width * 2 + 'rpx',
   height: props.height * 2 + 'rpx'
}
</script>

<style scoped lang="scss">
/* 设置容器的样式 */

/* 设置大行星的样式 */
.planet-large {
   background-color: #f0f;
   animation: rotate 2s linear infinite;
   transform-origin: center;
}

/* 定义旋转动画 */
@keyframes rotate {
   0% {
      transform: translate(-50%, -50%) rotate(0deg);
   }

   100% {
      transform: translate(-50%, -50%) rotate(360deg);
   }
}
</style>